/**
 * APEX PT_DESIGN - LOGIN & PRELOADER UI CONTROLLER
 * Handles login card interactions, video background, preloader progress, and transitions.
 */

const LoginUI = (() => {
  let onLoginSuccessCallback = null;
  let isSubmitting = false;
  let preloaderFinished = false;
  let preloaderFallbackTimer = null;

  // DOM Elements cache
  let dom = {};

  function cacheDom() {
    dom = {
      loginScreen: document.getElementById('loginScreen'),
      loginForm: document.getElementById('loginForm'),
      emailInput: document.getElementById('loginEmail'),
      passwordInput: document.getElementById('loginPassword'),
      rememberCheckbox: document.getElementById('loginRemember'),
      submitBtn: document.getElementById('loginSubmitBtn'),
      submitBtnText: document.getElementById('loginSubmitText'),
      submitSpinner: document.getElementById('loginSpinner'),
      togglePasswordBtn: document.getElementById('togglePasswordBtn'),
      eyeIcon: document.getElementById('eyeIcon'),
      eyeOffIcon: document.getElementById('eyeOffIcon'),
      alertBox: document.getElementById('loginAlert'),
      alertText: document.getElementById('loginAlertText'),
      forgotPasswordBtn: document.getElementById('forgotPasswordBtn'),
      adminBypassBtn: document.getElementById('adminBypassBtn'),
      initPasswordsBtn: document.getElementById('initPasswordsBtn'),
      loginDevActions: document.getElementById('loginDevActions'),
      // Preloader
      preloaderScreen: document.getElementById('preloaderScreen'),
      preloaderVideo: document.getElementById('preloaderVideo'),
      preloaderStatusText: document.getElementById('preloaderStatusText'),
      preloaderSkipBtn: document.getElementById('preloaderSkipBtn'),
      // User Profile in Nav
      navUserPanel: document.getElementById('navUserPanel'),
      navUserName: document.getElementById('navUserName'),
      navUserRole: document.getElementById('navUserRole'),
      navLogoutBtn: document.getElementById('navLogoutBtn')
    };
  }

  function init(onSuccess) {
    cacheDom();
    onLoginSuccessCallback = onSuccess;

    // Check existing session
    const existingUser = Auth.getSession();
    if (existingUser) {
      updateNavUserProfile(existingUser);
      hideLoginScreen();
      hidePreloaderScreen();
      if (typeof onLoginSuccessCallback === 'function') {
        onLoginSuccessCallback(existingUser);
      }
      return;
    }

    // Pre-fill remembered email
    const rememberedEmail = Auth.getRememberedEmail();
    if (rememberedEmail && dom.emailInput) {
      dom.emailInput.value = rememberedEmail;
      if (dom.passwordInput) dom.passwordInput.focus();
    } else if (dom.emailInput) {
      dom.emailInput.focus();
    }

    bindEvents();
  }

  function bindEvents() {
    if (dom.loginForm) {
      dom.loginForm.addEventListener('submit', handleLoginSubmit);
    }

    if (dom.togglePasswordBtn) {
      dom.togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
    }

    if (dom.forgotPasswordBtn) {
      dom.forgotPasswordBtn.addEventListener('click', () => {
        alert('Vui lòng liên hệ Admin của hệ thống để được cấp lại mật khẩu.');
      });
    }

    // Dev Badges: Only available for Admin testing on Localhost
    const isLocalhost = ['localhost', '127.0.0.1', ''].includes(window.location.hostname) ||
                        window.location.protocol === 'file:';
    const urlParams = new URLSearchParams(window.location.search);
    const hasDevQuery = urlParams.get('dev') === 'true' || urlParams.get('admin_test') === 'true';

    if (isLocalhost) {
      // Show dev actions if URL has ?dev=true or ?admin_test=true
      if (hasDevQuery && dom.loginDevActions) {
        dom.loginDevActions.classList.remove('hidden');
        dom.loginDevActions.classList.add('show-dev');
      }

      // Secret Admin Shortcut on Localhost: Ctrl + Shift + A (toggle dev buttons)
      window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
          if (dom.loginDevActions) {
            dom.loginDevActions.classList.toggle('hidden');
            dom.loginDevActions.classList.toggle('show-dev');
          }
        }
      });

      if (dom.adminBypassBtn) {
        dom.adminBypassBtn.addEventListener('click', () => {
          setSubmitting(true);
          setTimeout(() => {
            window.location.href = '?admin_mode=true';
          }, 1200);
        });
      }

      if (dom.initPasswordsBtn) {
        dom.initPasswordsBtn.addEventListener('click', async () => {
          const sb = Auth.getClient();
          if (!sb) {
            alert('Không thể kết nối Supabase.');
            return;
          }
          const { data: users, error } = await sb.from('NMK_User').select('*');
          if (error || !users) {
            alert('Lỗi truy xuất tài khoản: ' + (error ? error.message : 'Unknown error'));
            return;
          }
          let output = '';
          for (let u of users) {
            if (!u.password) {
              const pwd = Math.random().toString(36).slice(-8);
              const h = await Auth.hashPassword(pwd);
              await sb.from('NMK_User').update({ password: h }).eq('id', u.id);
              output += `${u.email}: ${pwd}\n`;
            }
          }
          if (output) alert('Mật khẩu mới đã khởi tạo:\n' + output);
          else alert('Tất cả tài khoản trong hệ thống đều đã có mật khẩu.');
        });
      }
    } else {
      // On non-localhost (Production/Staging): completely remove dev actions from DOM
      if (dom.loginDevActions && dom.loginDevActions.parentNode) {
        dom.loginDevActions.parentNode.removeChild(dom.loginDevActions);
      }
    }

    if (dom.preloaderSkipBtn) {
      dom.preloaderSkipBtn.addEventListener('click', finishPreloader);
    }

    // Keyboard shortcut to skip preloader (Escape or Space)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.code === 'Space') {
        if (!preloaderFinished && dom.preloaderScreen && !dom.preloaderScreen.classList.contains('hidden')) {
          e.preventDefault();
          finishPreloader();
        }
      }
    });

    if (dom.navLogoutBtn) {
      dom.navLogoutBtn.addEventListener('click', handleLogout);
    }

    // Clear alert when user types
    if (dom.emailInput) {
      dom.emailInput.addEventListener('input', hideAlert);
    }
    if (dom.passwordInput) {
      dom.passwordInput.addEventListener('input', hideAlert);
    }
  }

  async function handleLoginSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;

    hideAlert();
    const email = dom.emailInput ? dom.emailInput.value.trim() : '';
    const password = dom.passwordInput ? dom.passwordInput.value : '';
    const rememberMe = dom.rememberCheckbox ? dom.rememberCheckbox.checked : true;

    if (!email) {
      showAlert('Vui lòng nhập địa chỉ email.', 'error');
      dom.emailInput.focus();
      return;
    }

    if (!password) {
      showAlert('Vui lòng nhập mật khẩu.', 'error');
      dom.passwordInput.focus();
      return;
    }

    setSubmitting(true);

    try {
      const user = await Auth.login(email, password, rememberMe);
      updateNavUserProfile(user);
      
      // Hide login card with smooth fade
      hideLoginScreen();

      // Launch Preloader animation
      startPreloader(user);
    } catch (err) {
      setSubmitting(false);
      showAlert(err.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại.', 'error');
    }
  }

  function togglePasswordVisibility() {
    if (!dom.passwordInput) return;
    const isPassword = dom.passwordInput.type === 'password';
    dom.passwordInput.type = isPassword ? 'text' : 'password';

    if (dom.eyeIcon && dom.eyeOffIcon) {
      dom.eyeIcon.style.display = isPassword ? 'none' : 'block';
      dom.eyeOffIcon.style.display = isPassword ? 'block' : 'none';
    }
  }

  function setSubmitting(loading) {
    isSubmitting = loading;
    if (dom.submitBtn) {
      dom.submitBtn.disabled = loading;
    }
    if (dom.submitSpinner && dom.submitBtnText) {
      dom.submitSpinner.style.display = loading ? 'block' : 'none';
      dom.submitBtnText.style.display = loading ? 'none' : 'block';
    }
  }

  function showAlert(message, type = 'error') {
    if (!dom.alertBox || !dom.alertText) return;
    dom.alertBox.className = `login-alert ${type}`;
    dom.alertText.textContent = message;
    dom.alertBox.style.display = 'flex';
  }

  function hideAlert() {
    if (!dom.alertBox) return;
    dom.alertBox.style.display = 'none';
  }

  function hideLoginScreen() {
    if (dom.loginScreen) {
      dom.loginScreen.classList.add('hidden');
    }
  }

  function showLoginScreen() {
    if (dom.loginScreen) {
      dom.loginScreen.classList.remove('hidden');
    }
    if (dom.passwordInput) {
      dom.passwordInput.value = '';
    }
    setSubmitting(false);
    hideAlert();
  }

  /* ==========================================================================
     PRELOADER CONTROLLER
     ========================================================================== */
  function startPreloader(user) {
    if (!dom.preloaderScreen) {
      finishPreloader();
      return;
    }

    preloaderFinished = false;
    dom.preloaderScreen.classList.remove('hidden');

    const video = dom.preloaderVideo;
    if (video) {
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn('Preloader video autoplay blocked, falling back to timer:', err);
          simulateProgress(user);
        });
      }

      // Synchronize progress bar with video duration
      video.ontimeupdate = () => {
        if (preloaderFinished) return;
        const duration = video.duration || 4.5;
        const current = video.currentTime;
        const percent = Math.min(Math.round((current / duration) * 100), 100);
        updateProgressDisplay(percent);
      };

      video.onended = () => {
        finishPreloader(user);
      };
    } else {
      simulateProgress(user);
    }

    // Fallback timer: if video doesn't play within 2.5s, simulate loading
    clearTimeout(preloaderFallbackTimer);
    preloaderFallbackTimer = setTimeout(() => {
      if (!preloaderFinished) {
        console.warn('Video play not detected. Activating robust fallback loader.');
        simulateProgress(user);
      }
    }, 2500);
  }

  function updateProgressDisplay(percent) {
    const val = Math.min(Math.round(percent), 100);
    if (dom.preloaderStatusText) {
      dom.preloaderStatusText.textContent = `LOADING : ${val}%`;
    }
  }

  function simulateProgress(user) {
    let p = 0;
    const interval = setInterval(() => {
      if (preloaderFinished) {
        clearInterval(interval);
        return;
      }
      p += Math.floor(Math.random() * 8) + 4;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        updateProgressDisplay(100);
        setTimeout(() => finishPreloader(user), 400);
      } else {
        updateProgressDisplay(p);
      }
    }, 120);
  }

  function finishPreloader(user) {
    if (preloaderFinished) return;
    preloaderFinished = true;
    clearTimeout(preloaderFallbackTimer);

    updateProgressDisplay(100);

    setTimeout(() => {
      hidePreloaderScreen();

      if (dom.preloaderVideo) {
        dom.preloaderVideo.pause();
      }

      const activeUser = user || Auth.getSession();
      updateNavUserProfile(activeUser);

      if (typeof onLoginSuccessCallback === 'function') {
        onLoginSuccessCallback(activeUser);
      }
    }, 400);
  }

  function hidePreloaderScreen() {
    if (dom.preloaderScreen) {
      dom.preloaderScreen.classList.add('hidden');
    }
  }

  /* ==========================================================================
     NAVBAR USER & LOGOUT & PROFILE MODAL
     ========================================================================== */
  function updateNavUserProfile(user) {
    if (!user) return;
    if (dom.navUserName) {
      dom.navUserName.textContent = user.fullName || user.name || user.email;
    }
    if (dom.navUserRole) {
      dom.navUserRole.textContent = user.role || 'Member';
    }
    if (dom.navUserPanel) {
      dom.navUserPanel.style.display = 'inline-flex';
    }

    // Update Profile Modal (Image 3)
    const modalUserName = document.getElementById('modalUserName');
    const modalUserPosition = document.getElementById('modalUserPosition');
    const modalUserTag = document.getElementById('modalUserTag');
    const modalUserEmail = document.getElementById('modalUserEmail');
    const modalUserCompany = document.getElementById('modalUserCompany');
    const modalUserLocation = document.getElementById('modalUserLocation');
    const modalUserDepartment = document.getElementById('modalUserDepartment');
    const modalUserTitle = document.getElementById('modalUserTitle');

    const displayName = user.fullName || user.name || user.email;
    const roleName = user.role || 'Member';

    if (modalUserName) modalUserName.textContent = displayName;
    if (modalUserPosition) modalUserPosition.textContent = user.position || roleName;
    if (modalUserTag) modalUserTag.textContent = roleName.toUpperCase();
    if (modalUserEmail) modalUserEmail.textContent = user.email || 'user@apexengineers.com.au';
    if (modalUserCompany) modalUserCompany.textContent = 'APEX Southern Cross Engineering';
    if (modalUserLocation) modalUserLocation.textContent = user.location || 'VIETNAM';
    if (modalUserDepartment) modalUserDepartment.textContent = user.team || user.department || 'Engineering';
    if (modalUserTitle) modalUserTitle.textContent = user.position || roleName;
  }

  function openProfileModal() {
    const user = Auth.getSession();
    if (user) updateNavUserProfile(user);
    const backdrop = document.getElementById('profileModalBackdrop');
    if (backdrop) {
      backdrop.classList.add('active');
    }
  }

  function closeProfileModal() {
    const backdrop = document.getElementById('profileModalBackdrop');
    if (backdrop) {
      backdrop.classList.remove('active');
    }
  }

  function handleLogout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?')) {
      closeProfileModal();
      Auth.logout();
      if (dom.navUserPanel) {
        dom.navUserPanel.style.display = 'none';
      }
      if (typeof App !== 'undefined' && App.hideApp) {
        App.hideApp();
      }
      showLoginScreen();
    }
  }

  return {
    init,
    showLoginScreen,
    hideLoginScreen,
    handleLogout,
    updateNavUserProfile,
    openProfileModal,
    closeProfileModal
  };
})();
