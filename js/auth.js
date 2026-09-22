/**
 * APEX PT_DESIGN - AUTHENTICATION MODULE
 * Direct port of AuthContext.jsx from NMK Report project.
 * Uses Supabase NMK_User table, SHA-256 client-side hashing, and localStorage 'last_login_email'.
 */

const Auth = (() => {
  const SUPABASE_URL = 'https://ejyirnfxuezipogweybo.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_r1DKG_nf_nyivQgbe6D7YA_zow13__G';
  const STORAGE_KEY = 'last_login_email';
  const SESSION_DATA_KEY = 'apex_pt_user_session';

  let client = null;
  let currentUser = null;

  // Initialize Supabase client
  function getClient() {
    if (!client) {
      if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
        client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      } else {
        console.error('Supabase library not loaded');
      }
    }
    return client;
  }

  // SHA-256 Hash implementation using browser Web Crypto API
  async function hashPassword(password) {
    if (!password) return '';
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Fetch user from NMK_User table by email
  async function syncUserWithSupabase(email) {
    const sb = getClient();
    if (!sb) return null;
    try {
      const cleanEmail = (email || '').toLowerCase().trim();
      const { data, error } = await sb
        .from('NMK_User')
        .select('*')
        .ilike('email', cleanEmail)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user from Supabase:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Unexpected error during Supabase sync:', err);
      return null;
    }
  }

  function isEngineerOrAdmin(user) {
    if (!user) return false;
    const roleStr = `${user.user_role || user.role || user.Role || user.access_level || ''}`.toLowerCase();
    const posStr = `${user.position || ''}`.toLowerCase();
    const teamStr = `${user.team_name || user.team || ''}`.toLowerCase();

    // 1. Admin & Managers
    if (roleStr.includes('admin') || posStr.includes('admin') || posStr.includes('manager')) {
      return true;
    }

    // 2. Engineers
    if (roleStr.includes('engineer') || posStr.includes('engineer')) {
      return true;
    }

    // 3. Slab Design / Structural Design teams (excluding Drafters)
    if (teamStr.includes('slab') || teamStr.includes('design') || teamStr.includes('structural')) {
      if (!posStr.includes('drafter')) {
        return true;
      }
    }

    // 4. Technical Leaders (excluding drafters)
    if (roleStr.includes('leader') && !posStr.includes('drafter')) {
      return true;
    }

    return false;
  }

  function formatUserSession(dbUser) {
    if (!dbUser) return null;
    const roleField = dbUser.user_role || dbUser.role || dbUser.Role || dbUser.access_level || '';
    const roleValue = roleField.toString().trim().toLowerCase();
    const isAdmin = roleValue.includes('admin');
    const isLeader = roleValue.includes('leader');

    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name || dbUser.full_name || dbUser.email.split('@')[0],
      fullName: dbUser.full_name || dbUser.name || '',
      role: dbUser.user_role || 'User',
      team: dbUser.team_name || dbUser.team || '',
      location: dbUser.location || '',
      position: dbUser.position || '',
      image: dbUser.image || null,
      isAdmin,
      isLeader,
      loginAt: new Date().toISOString()
    };
  }

  /**
   * Log in user with email and password
   */
  async function login(email, password, rememberMe = true) {
    const sb = getClient();
    if (!sb) {
      throw new Error('Không thể kết nối đến máy chủ xác thực.');
    }

    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail) {
      throw new Error('Vui lòng nhập địa chỉ email.');
    }
    if (!password) {
      throw new Error('Vui lòng nhập mật khẩu.');
    }

    const dbUser = await syncUserWithSupabase(cleanEmail);
    if (!dbUser) {
      throw new Error(`Email ${cleanEmail} không tồn tại trong hệ thống.`);
    }

    // Role-based Access Control: Chỉ dành cho Engineer & Admin
    if (!isEngineerOrAdmin(dbUser)) {
      throw new Error('Truy cập bị từ chối: Ứng dụng PT Design chỉ dành cho Kỹ sư (Engineer) và Quản trị viên (Admin).');
    }

    const hashedPassword = await hashPassword(password);

    // Case 1: First time login - set password
    if (!dbUser.password) {
      const { error: updateError } = await sb
        .from('NMK_User')
        .update({ password: hashedPassword })
        .eq('email', cleanEmail);

      if (updateError) {
        throw new Error('Lỗi khi thiết lập mật khẩu mới: ' + updateError.message);
      }
      dbUser.password = hashedPassword;
    } 
    // Case 2: Verify password
    else if (dbUser.password !== hashedPassword && dbUser.password !== password) {
      throw new Error('Mật khẩu không chính xác. Vui lòng thử lại.');
    } 
    // Case 3: Upgrade plain text password to SHA-256
    else if (dbUser.password === password) {
      await sb
        .from('NMK_User')
        .update({ password: hashedPassword })
        .eq('email', cleanEmail);
      dbUser.password = hashedPassword;
    }

    const sessionUser = formatUserSession(dbUser);
    currentUser = sessionUser;

    if (rememberMe) {
      localStorage.setItem(STORAGE_KEY, cleanEmail);
    }
    localStorage.setItem(SESSION_DATA_KEY, JSON.stringify(sessionUser));

    return sessionUser;
  }

  // Check stored session on startup (with URL bypass support)
  function getSession() {
    if (currentUser) return currentUser;

    // Check admin/leader bypass query params
    if (typeof window !== 'undefined' && window.location) {
      const queryParams = new URLSearchParams(window.location.search);
      if (queryParams.get('admin_mode') === 'true') {
        currentUser = {
          name: 'Super Admin',
          email: 'admin@apexengineers.com.au',
          role: 'Admin',
          isAdmin: true,
          isLeader: true,
          team: 'Management',
          location: 'AUSTRALIA'
        };
        return currentUser;
      }
      if (queryParams.get('leader_mode') === 'true') {
        currentUser = {
          name: 'Team Leader',
          email: 'leader@apexengineers.com.au',
          role: 'Leader',
          isAdmin: false,
          isLeader: true,
          team: 'Design',
          location: 'VIETNAM'
        };
        return currentUser;
      }
    }

    // Try reading cached session
    try {
      const stored = localStorage.getItem(SESSION_DATA_KEY);
      if (stored) {
        currentUser = JSON.parse(stored);
        return currentUser;
      }
    } catch (e) {
      console.warn('Failed to read session:', e);
    }

    return null;
  }

  function getRememberedEmail() {
    return localStorage.getItem(STORAGE_KEY) || '';
  }

  function logout() {
    currentUser = null;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SESSION_DATA_KEY);
  }

  return {
    getClient,
    login,
    logout,
    getSession,
    getRememberedEmail,
    syncUserWithSupabase,
    hashPassword,
    isEngineerOrAdmin
  };
})();
