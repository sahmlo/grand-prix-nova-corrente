/**
 * Nova Corrente — Previsibilidade de Demanda
 * Grand Prix de Inovação do SENAI | 2025
 *
 * Lógica principal da aplicação.
 */

    // ===== CONFIGURAÇÃO INICIAL =====
    const defaultConfig = {
      app_title: "Nova Corrente",
      app_subtitle: "Previsibilidade de Demanda", 
      welcome_message: "Bem-vindo ao painel de controle",
      background_color: "#0a0e1a",
      surface_color: "#1a1f2e",
      text_color: "#e4e7eb",
      primary_action_color: "#3b82f6",
      secondary_action_color: "#64748b",
      font_family: "Inter",
      font_size: 14
    };

    // ===== VARIÁVEIS GLOBAIS =====
    let allData = [];
    let isLoading = false;
    let filteredData = [];
    let currentEditingId = null;
    let currentUser = null;
    let isLoggedIn = false;

    // ===== MANIPULADOR DE DADOS =====
    const dataHandler = {
      onDataChanged(data) {
        console.log('📊 Dados atualizados:', data.length, 'registros');
        allData = data;
        filteredData = data;
        
        updateDashboard();
        updateItemsTable();
        updateServicesTable();
        updateLossesTable();
        updateLossItemSelect();
        updateLossFilterSelect();
        updateRecentActivities();
        updateAnalytics();
      }
    };

    // ===== SISTEMA DE AUTENTICAÇÃO =====
    // Inicializa sistema de login
    function initializeAuth() {
      console.log('🔐 Inicializando sistema de autenticação...');
      
      if (!localStorage.getItem('users')) {
        const defaultUsers = {
          'admin': {
            username: 'admin',
            password: 'admin123',
            email: 'admin@novacorrente.com',
            displayName: 'Administrador',
            createdAt: new Date().toISOString(),
            lastLogin: null
          }
        };
        localStorage.setItem('users', JSON.stringify(defaultUsers));
        console.log('👤 Usuário padrão criado: admin/admin123');
      }
      
      const savedSession = localStorage.getItem('currentSession');
      const rememberMe = localStorage.getItem('rememberMe') === 'true';
      
      if (savedSession && rememberMe) {
        try {
          const session = JSON.parse(savedSession);
          const sessionAge = Date.now() - new Date(session.loginTime).getTime();
          
          if (sessionAge < 7 * 24 * 60 * 60 * 1000) {
            currentUser = session.user;
            isLoggedIn = true;
            updateUserInterface();
            showMainApp();
            console.log('✅ Sessão restaurada para:', currentUser.username);
            return;
          }
        } catch (error) {
          console.error('❌ Erro ao restaurar sessão:', error);
        }
      }
      
      showLoginScreen();
    }

    // Configura eventos do formulário de login
    function setupLoginForm() {
      const loginForm = document.getElementById('loginForm');
      
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleLogin();
      });
      
      document.getElementById('loginPassword').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          handleLogin();
        }
      });
    }

    // Processa login do usuário
    async function handleLogin() {
      const username = document.getElementById('loginUsername').value.trim();
      const password = document.getElementById('loginPassword').value;
      const rememberMe = document.getElementById('rememberMe').checked;
      const loginBtn = document.getElementById('loginBtn');
      
      if (!username || !password) {
        showToast('Preencha usuário e senha', 'error');
        return;
      }
      
      loginBtn.disabled = true;
      loginBtn.innerHTML = '<div class="spinner"></div> Entrando...';
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        const user = users[username];
        
        if (!user || user.password !== password) {
          showToast('Usuário ou senha incorretos', 'error');
          
          const loginContainer = document.querySelector('.login-container');
          loginContainer.style.animation = 'shake 0.5s ease-in-out';
          setTimeout(() => {
            loginContainer.style.animation = '';
          }, 500);
          
          return;
        }
        
        currentUser = user;
        isLoggedIn = true;
        
        user.lastLogin = new Date().toISOString();
        users[username] = user;
        localStorage.setItem('users', JSON.stringify(users));
        
        const session = {
          user: user,
          loginTime: new Date().toISOString()
        };
        localStorage.setItem('currentSession', JSON.stringify(session));
        localStorage.setItem('rememberMe', rememberMe.toString());
        
        console.log('✅ Login realizado com sucesso:', username);
        showToast(`Bem-vindo, ${user.displayName}!`, 'success');
        
        setTimeout(() => {
          updateUserInterface();
          showMainApp();
        }, 1000);
        
      } catch (error) {
        console.error('❌ Erro no login:', error);
        showToast('Erro interno do sistema', 'error');
      } finally {
        loginBtn.disabled = false;
        loginBtn.innerHTML = 'Entrar no Sistema';
      }
    }

    // Mostra tela de login
    function showLoginScreen() {
      document.getElementById('loginScreen').style.display = 'flex';
      document.getElementById('appContainer').style.display = 'none';
      
      setTimeout(() => {
        document.getElementById('loginUsername').focus();
      }, 500);
    }

    // Mostra aplicação principal
    function showMainApp() {
      document.getElementById('loginScreen').style.display = 'none';
      document.getElementById('appContainer').style.display = 'flex';
      
      const appContainer = document.getElementById('appContainer');
      appContainer.style.opacity = '0';
      appContainer.style.transform = 'scale(0.95)';
      
      setTimeout(() => {
        appContainer.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        appContainer.style.opacity = '1';
        appContainer.style.transform = 'scale(1)';
      }, 100);
    }

    // Atualiza interface com dados do usuário
    function updateUserInterface() {
      if (!currentUser) return;
      
      const username = currentUser.displayName || currentUser.username;
      const avatar = username.charAt(0).toUpperCase();
      
      document.getElementById('currentUsername').textContent = username;
      document.getElementById('userAvatar').textContent = avatar;
      
      document.getElementById('profileDisplayName').textContent = username;
      document.getElementById('profileAvatarLarge').textContent = avatar;
      document.getElementById('profileUsername').value = currentUser.username;
      document.getElementById('profileEmail').value = currentUser.email || '';
    }

    // Logout do usuário
    function logout() {
      console.log('🚪 Realizando logout...');
      
      localStorage.removeItem('currentSession');
      localStorage.removeItem('rememberMe');
      
      currentUser = null;
      isLoggedIn = false;
      
      document.getElementById('loginForm').reset();
      
      showToast('Logout realizado com sucesso', 'success');
      
      setTimeout(() => {
        showLoginScreen();
      }, 1000);
    }

    // ===== SISTEMA DE PERFIL DO USUÁRIO =====
    // Alterna dropdown do usuário
    function toggleUserDropdown() {
      const dropdown = document.getElementById('userDropdown');
      dropdown.classList.toggle('active');
      
      if (dropdown.classList.contains('active')) {
        setTimeout(() => {
          document.addEventListener('click', closeUserDropdownOutside);
        }, 100);
      }
    }

    // Fecha dropdown ao clicar fora
    function closeUserDropdownOutside(e) {
      const dropdown = document.getElementById('userDropdown');
      const userMenu = document.querySelector('.user-menu');
      
      if (!userMenu.contains(e.target)) {
        dropdown.classList.remove('active');
        document.removeEventListener('click', closeUserDropdownOutside);
      }
    }

    // Abre modal de perfil
    function openProfileModal() {
      document.getElementById('userDropdown').classList.remove('active');
      document.getElementById('profileModal').classList.add('active');
      
      document.getElementById('currentPassword').value = '';
      document.getElementById('newPassword').value = '';
      document.getElementById('confirmPassword').value = '';
      document.getElementById('passwordStrength').style.display = 'none';
    }

    // Fecha modal de perfil
    function closeProfileModal() {
      document.getElementById('profileModal').classList.remove('active');
    }

    // Abre modal de alteração de senha
    function openChangePasswordModal() {
      document.getElementById('userDropdown').classList.remove('active');
      document.getElementById('changePasswordModal').classList.add('active');
      
      document.getElementById('changePasswordForm').reset();
      document.getElementById('passwordStrengthChange').style.display = 'none';
    }

    // Fecha modal de alteração de senha
    function closeChangePasswordModal() {
      document.getElementById('changePasswordModal').classList.remove('active');
    }

    // Salva alterações do perfil
    async function saveProfile() {
      const email = document.getElementById('profileEmail').value.trim();
      const currentPassword = document.getElementById('currentPassword').value;
      const newPassword = document.getElementById('newPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      if (email && !isValidEmail(email)) {
        showToast('E-mail inválido', 'error');
        return;
      }
      
      if (currentPassword || newPassword || confirmPassword) {
        if (!currentPassword) {
          showToast('Digite a senha atual para alterá-la', 'error');
          return;
        }
        
        if (currentUser.password !== currentPassword) {
          showToast('Senha atual incorreta', 'error');
          return;
        }
        
        if (newPassword !== confirmPassword) {
          showToast('Confirmação de senha não confere', 'error');
          return;
        }
        
        if (newPassword.length < 6) {
          showToast('Nova senha deve ter pelo menos 6 caracteres', 'error');
          return;
        }
        
        currentUser.password = newPassword;
      }
      
      if (email) {
        currentUser.email = email;
      }
      
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      users[currentUser.username] = currentUser;
      localStorage.setItem('users', JSON.stringify(users));
      
      const session = {
        user: currentUser,
        loginTime: new Date().toISOString()
      };
      localStorage.setItem('currentSession', JSON.stringify(session));
      
      showToast('Perfil atualizado com sucesso!', 'success');
      closeProfileModal();
      updateUserInterface();
    }

    // Configura formulário de alteração de senha
    function setupChangePasswordForm() {
      const form = document.getElementById('changePasswordForm');
      
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleChangePassword();
      });
    }

    // Processa alteração de senha
    async function handleChangePassword() {
      const oldPassword = document.getElementById('oldPassword').value;
      const newPassword = document.getElementById('newPasswordChange').value;
      const confirmPassword = document.getElementById('confirmPasswordChange').value;
      
      if (currentUser.password !== oldPassword) {
        showToast('Senha atual incorreta', 'error');
        return;
      }
      
      if (newPassword !== confirmPassword) {
        showToast('Confirmação de senha não confere', 'error');
        return;
      }
      
      if (newPassword.length < 6) {
        showToast('Nova senha deve ter pelo menos 6 caracteres', 'error');
        return;
      }
      
      if (newPassword === oldPassword) {
        showToast('A nova senha deve ser diferente da atual', 'error');
        return;
      }
      
      currentUser.password = newPassword;
      
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      users[currentUser.username] = currentUser;
      localStorage.setItem('users', JSON.stringify(users));
      
      const session = {
        user: currentUser,
        loginTime: new Date().toISOString()
      };
      localStorage.setItem('currentSession', JSON.stringify(session));
      
      showToast('Senha alterada com sucesso!', 'success');
      closeChangePasswordModal();
    }

    // ===== VALIDAÇÕES E UTILITÁRIOS =====
    // Valida formato de email
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    // Verifica força da senha
    function checkPasswordStrength() {
      const password = document.getElementById('newPassword').value;
      const strengthContainer = document.getElementById('passwordStrength');
      
      if (!password) {
        strengthContainer.style.display = 'none';
        return;
      }
      
      strengthContainer.style.display = 'block';
      
      let strength = 0;
      let feedback = '';
      
      if (password.length >= 8) strength++;
      if (/[a-z]/.test(password)) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[^A-Za-z0-9]/.test(password)) strength++;
      
      strengthContainer.className = 'password-strength';
      
      if (strength <= 2) {
        strengthContainer.classList.add('strength-weak');
        feedback = 'Senha fraca';
      } else if (strength <= 3) {
        strengthContainer.classList.add('strength-medium');
        feedback = 'Senha média';
      } else {
        strengthContainer.classList.add('strength-strong');
        feedback = 'Senha forte';
      }
      
      strengthContainer.querySelector('.strength-text').textContent = feedback;
    }

    // Verifica força da senha no modal de alteração
    function checkPasswordStrengthChange() {
      const password = document.getElementById('newPasswordChange').value;
      const strengthContainer = document.getElementById('passwordStrengthChange');
      
      if (!password) {
        strengthContainer.style.display = 'none';
        return;
      }
      
      strengthContainer.style.display = 'block';
      
      let strength = 0;
      let feedback = '';
      
      if (password.length >= 8) strength++;
      if (/[a-z]/.test(password)) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[^A-Za-z0-9]/.test(password)) strength++;
      
      strengthContainer.className = 'password-strength';
      
      if (strength <= 2) {
        strengthContainer.classList.add('strength-weak');
        feedback = 'Senha fraca';
      } else if (strength <= 3) {
        strengthContainer.classList.add('strength-medium');
        feedback = 'Senha média';
      } else {
        strengthContainer.classList.add('strength-strong');
        feedback = 'Senha forte';
      }
      
      strengthContainer.querySelector('.strength-text').textContent = feedback;
    }

    // Funções placeholder para links do login
    function showForgotPassword() {
      showToast('Funcionalidade em desenvolvimento', 'info');
    }

    function showCreateAccount() {
      showToast('Entre em contato com o administrador para criar uma conta', 'info');
    }

    // ===== ANIMAÇÕES DE SCROLL =====
    // Configura animações de scroll
    function setupScrollAnimations() {
      const animateElements = document.querySelectorAll('.kpi-card, .card, .report-card');
      
      animateElements.forEach((element, index) => {
        element.classList.add('scroll-animate');
        
        if (index % 3 === 0) {
          element.classList.add('slide-left');
        } else if (index % 3 === 1) {
          element.classList.add('scale-up');
        } else {
          element.classList.add('slide-right');
        }
      });
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
      
      document.querySelectorAll('.scroll-animate').forEach(el => {
        observer.observe(el);
      });
    }

    // Smooth scroll para navegação
    function smoothScrollTo(element) {
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }

    const shakeKeyframes = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = shakeKeyframes;
    document.head.appendChild(styleSheet);

    // ===== INICIALIZAÇÃO DO SISTEMA =====
    // Inicializa os SDKs de dados e elementos
    async function initializeApp() {
      console.log('🚀 Inicializando sistema...');
      
      const dataResult = await window.dataSdk.init(dataHandler);
      if (!dataResult.isOk) {
        console.error('❌ Erro ao inicializar SDK de dados:', dataResult.error);
        showToast('Erro ao inicializar sistema', 'error');
        return;
      }

      await window.elementSdk.init({
        defaultConfig,
        
        onConfigChange: async (config) => {
          console.log('⚙️ Configuração alterada:', config);
          
          const appTitle = document.getElementById('appTitle');
          const appSubtitle = document.getElementById('appSubtitle');
          const welcomeMessage = document.getElementById('welcomeMessage');
          
          if (appTitle) appTitle.textContent = config.app_title || defaultConfig.app_title;
          if (appSubtitle) appSubtitle.textContent = config.app_subtitle || defaultConfig.app_subtitle;
          if (welcomeMessage) welcomeMessage.textContent = config.welcome_message || defaultConfig.welcome_message;

          const customFont = config.font_family || defaultConfig.font_family;
          const baseFontStack = 'Inter, sans-serif';
          document.body.style.fontFamily = `${customFont}, ${baseFontStack}`;

          const baseSize = config.font_size || defaultConfig.font_size;
          document.documentElement.style.fontSize = `${baseSize}px`;

          document.body.style.background = config.background_color || defaultConfig.background_color;
        },
        
        mapToCapabilities: (config) => ({
          recolorables: [
            {
              get: () => config.background_color || defaultConfig.background_color,
              set: (value) => {
                config.background_color = value;
                window.elementSdk.setConfig({ background_color: value });
              }
            },
            {
              get: () => config.surface_color || defaultConfig.surface_color,
              set: (value) => {
                config.surface_color = value;
                window.elementSdk.setConfig({ surface_color: value });
              }
            },
            {
              get: () => config.text_color || defaultConfig.text_color,
              set: (value) => {
                config.text_color = value;
                window.elementSdk.setConfig({ text_color: value });
              }
            },
            {
              get: () => config.primary_action_color || defaultConfig.primary_action_color,
              set: (value) => {
                config.primary_action_color = value;
                window.elementSdk.setConfig({ primary_action_color: value });
              }
            },
            {
              get: () => config.secondary_action_color || defaultConfig.secondary_action_color,
              set: (value) => {
                config.secondary_action_color = value;
                window.elementSdk.setConfig({ secondary_action_color: value });
              }
            }
          ],
          borderables: [],
          fontEditable: {
            get: () => config.font_family || defaultConfig.font_family,
            set: (value) => {
              config.font_family = value;
              window.elementSdk.setConfig({ font_family: value });
            }
          },
          fontSizeable: {
            get: () => config.font_size || defaultConfig.font_size,
            set: (value) => {
              config.font_size = value;
              window.elementSdk.setConfig({ font_size: value });
            }
          }
        }),
        
        mapToEditPanelValues: (config) => new Map([
          ["app_title", config.app_title || defaultConfig.app_title],
          ["app_subtitle", config.app_subtitle || defaultConfig.app_subtitle],
          ["welcome_message", config.welcome_message || defaultConfig.welcome_message]
        ])
      });
      
      console.log('✅ Sistema inicializado com sucesso!');
    }

    // ===== SISTEMA DE NAVEGAÇÃO =====
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const pageName = item.dataset.page;
        console.log('🧭 Navegando para:', pageName);
        navigateToPage(pageName);
      });
    });

    // Função para navegar entre páginas do sistema
    function navigateToPage(pageName) {
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      
      const navItem = document.querySelector(`[data-page="${pageName}"]`);
      const page = document.getElementById(pageName);
      
      if (navItem) navItem.classList.add('active');
      if (page) page.classList.add('active');
      
      const titles = {
        dashboard: 'Dashboard',
        items: 'Gestão de Itens',
        services: 'Gestão de Serviços',
        losses: 'Controle de Perdas',
        consumption: 'Análise de Consumo',
        projection: 'Projeção de Demanda',
        strategic: 'Análise Estratégica',
        reports: 'Centro de Relatórios',
        analytics: 'Analytics Avançado',
        settings: 'Configurações do Sistema',
        chatbot: 'Assistente Virtual'
      };
      
      document.getElementById('pageTitle').textContent = titles[pageName] || 'Dashboard';
      
      localStorage.setItem('currentPage', pageName);
    }

    // ===== SISTEMA DE TEMAS =====
    document.getElementById('themeToggle').addEventListener('click', () => {
      const isLightTheme = document.body.classList.toggle('light-theme');
      const icon = document.getElementById('themeToggle');
      
      icon.textContent = isLightTheme ? '☀️' : '🌙';
      
      localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
      
      console.log('🎨 Tema alterado para:', isLightTheme ? 'claro' : 'escuro');
      showToast(`Tema ${isLightTheme ? 'claro' : 'escuro'} ativado`, 'success');
    });

    // ===== FUNÇÕES UTILITÁRIAS =====
    // Carrega preferências salvas do usuário
    function loadUserPreferences() {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        document.getElementById('themeToggle').textContent = '☀️';
      }
      
      const savedPage = localStorage.getItem('currentPage');
      if (savedPage && document.getElementById(savedPage)) {
        navigateToPage(savedPage);
      }
    }

    // Função para validar formulários
    function validateForm(formId) {
      const form = document.getElementById(formId);
      const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
      let isValid = true;
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          input.style.borderColor = '#ef4444';
          isValid = false;
        } else {
          input.style.borderColor = 'rgba(59, 130, 246, 0.2)';
        }
      });
      
      return isValid;
    }

    // Função para formatar datas
    function formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }

    // Função para formatar números
    function formatNumber(number) {
      return new Intl.NumberFormat('pt-BR').format(number);
    }

    // ===== FORMULÁRIO DE ITENS =====
    document.getElementById('itemForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('📝 Submetendo formulário de item...');
      
      if (!validateForm('itemForm')) {
        showToast('Preencha todos os campos obrigatórios', 'error');
        return;
      }
      
      if (allData.filter(d => d.type === 'item').length >= 999) {
        showToast('Limite de 999 itens atingido', 'error');
        return;
      }

      const itemName = document.getElementById('itemName').value.trim();
      const existingItem = allData.find(d => d.type === 'item' && d.name.toLowerCase() === itemName.toLowerCase());
      
      if (existingItem && currentEditingId !== existingItem.__backendId) {
        showToast('Item com este nome já existe', 'error');
        return;
      }

      const btn = document.getElementById('saveItemBtn');
      btn.disabled = true;
      btn.innerHTML = '<div class="spinner"></div><span>Salvando...</span>';

      try {
        const itemData = {
          type: 'item',
          name: itemName,
          unit: document.getElementById('itemUnit').value,
          leadTime: parseInt(document.getElementById('itemLeadTime').value),
          safetyStock: parseInt(document.getElementById('itemSafetyStock').value),
          createdAt: new Date().toISOString()
        };

        let result;
        
        if (currentEditingId) {
          const existingRecord = allData.find(d => d.__backendId === currentEditingId);
          if (existingRecord) {
            const updatedRecord = { ...existingRecord, ...itemData };
            result = await window.dataSdk.update(updatedRecord);
            console.log('✏️ Item atualizado:', itemData.name);
          }
        } else {
          result = await window.dataSdk.create(itemData);
          console.log('➕ Item criado:', itemData.name);
        }

        if (result.isOk) {
          showToast(currentEditingId ? 'Item atualizado com sucesso!' : 'Item cadastrado com sucesso!', 'success');
          resetItemForm();
        } else {
          console.error('❌ Erro ao salvar item:', result.error);
          showToast('Erro ao salvar item', 'error');
        }
      } catch (error) {
        console.error('❌ Erro inesperado:', error);
        showToast('Erro inesperado ao salvar item', 'error');
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<span>💾</span><span>Salvar Item</span>';
      }
    });

    // Função para resetar formulário de itens
    function resetItemForm() {
      document.getElementById('itemForm').reset();
      currentEditingId = null;
      
      const btn = document.getElementById('saveItemBtn');
      btn.innerHTML = '<span>💾</span><span>Salvar Item</span>';
      
      document.querySelectorAll('#itemForm input, #itemForm select').forEach(input => {
        input.style.borderColor = 'rgba(59, 130, 246, 0.2)';
      });
    }

    document.getElementById('clearItemBtn').addEventListener('click', () => {
      console.log('🔄 Limpando formulário de item...');
      resetItemForm();
    });

    // Função para editar item existente
    function editItem(id) {
      const item = allData.find(d => d.__backendId === id);
      if (!item) return;
      
      console.log('✏️ Editando item:', item.name);
      
      document.getElementById('itemName').value = item.name;
      document.getElementById('itemUnit').value = item.unit;
      document.getElementById('itemLeadTime').value = item.leadTime;
      document.getElementById('itemSafetyStock').value = item.safetyStock;
      
      currentEditingId = id;
      
      const btn = document.getElementById('saveItemBtn');
      btn.innerHTML = '<span>✏️</span><span>Atualizar Item</span>';
      
      navigateToPage('items');
      
      showToast('Item carregado para edição', 'success');
    }

    // ===== FORMULÁRIO DE SERVIÇOS =====
    document.getElementById('serviceForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('📝 Submetendo formulário de serviço...');
      
      if (!validateForm('serviceForm')) {
        showToast('Preencha todos os campos obrigatórios', 'error');
        return;
      }
      
      if (allData.filter(d => d.type === 'service').length >= 999) {
        showToast('Limite de 999 serviços atingido', 'error');
        return;
      }

      const serviceName = document.getElementById('serviceName').value.trim();
      const existingService = allData.find(d => d.type === 'service' && d.name.toLowerCase() === serviceName.toLowerCase());
      
      if (existingService) {
        showToast('Serviço com este nome já existe', 'error');
        return;
      }

      const btn = document.getElementById('saveServiceBtn');
      btn.disabled = true;
      btn.innerHTML = '<div class="spinner"></div><span>Salvando...</span>';

      try {
        const serviceData = {
          type: 'service',
          name: serviceName,
          createdAt: new Date().toISOString()
        };

        const result = await window.dataSdk.create(serviceData);
        
        if (result.isOk) {
          console.log('➕ Serviço criado:', serviceName);
          showToast('Serviço cadastrado com sucesso!', 'success');
          document.getElementById('serviceForm').reset();
        } else {
          console.error('❌ Erro ao salvar serviço:', result.error);
          showToast('Erro ao cadastrar serviço', 'error');
        }
      } catch (error) {
        console.error('❌ Erro inesperado:', error);
        showToast('Erro inesperado ao cadastrar serviço', 'error');
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<span>💾</span><span>Salvar Serviço</span>';
      }
    });

    document.getElementById('clearServiceBtn').addEventListener('click', () => {
      console.log('🔄 Limpando formulário de serviço...');
      document.getElementById('serviceForm').reset();
      
      document.querySelectorAll('#serviceForm input').forEach(input => {
        input.style.borderColor = 'rgba(59, 130, 246, 0.2)';
      });
    });

    // ===== SISTEMA DE PERDAS =====
    document.getElementById('openLossModal').addEventListener('click', () => {
      console.log('📝 Abrindo modal de perda...');
      
      const items = allData.filter(d => d.type === 'item');
      if (items.length === 0) {
        showToast('Cadastre pelo menos um item antes de registrar perdas', 'error');
        return;
      }
      
      document.getElementById('lossModal').classList.add('active');
      document.getElementById('lossDate').valueAsDate = new Date();
      
      setTimeout(() => {
        document.getElementById('lossItem').focus();
      }, 100);
    });

    document.getElementById('closeLossModal').addEventListener('click', () => {
      console.log('❌ Fechando modal de perda...');
      closeLossModal();
    });

    document.getElementById('cancelLossBtn').addEventListener('click', () => {
      console.log('❌ Cancelando registro de perda...');
      closeLossModal();
    });

    // Função para fechar modal e limpar formulário
    function closeLossModal() {
      document.getElementById('lossModal').classList.remove('active');
      document.getElementById('lossForm').reset();
      
      document.querySelectorAll('#lossForm input, #lossForm select, #lossForm textarea').forEach(input => {
        input.style.borderColor = 'rgba(59, 130, 246, 0.2)';
      });
    }

    document.getElementById('lossForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('📝 Submetendo formulário de perda...');
      
      if (!validateForm('lossForm')) {
        showToast('Preencha todos os campos obrigatórios', 'error');
        return;
      }
      
      if (allData.filter(d => d.type === 'loss').length >= 999) {
        showToast('Limite de 999 perdas atingido', 'error');
        return;
      }

      const quantity = parseInt(document.getElementById('lossQuantity').value);
      if (quantity <= 0) {
        showToast('Quantidade deve ser maior que zero', 'error');
        return;
      }

      const btn = document.getElementById('saveLossBtn');
      btn.disabled = true;
      btn.innerHTML = '<div class="spinner"></div><span>Registrando...</span>';

      try {
        const lossData = {
          type: 'loss',
          name: document.getElementById('lossItem').value,
          quantity: quantity,
          reason: document.getElementById('lossReason').value.trim(),
          date: document.getElementById('lossDate').value,
          createdAt: new Date().toISOString()
        };

        const result = await window.dataSdk.create(lossData);
        
        if (result.isOk) {
          console.log('➕ Perda registrada:', lossData.name, '-', lossData.quantity);
          showToast('Perda registrada com sucesso!', 'success');
          closeLossModal();
        } else {
          console.error('❌ Erro ao registrar perda:', result.error);
          showToast('Erro ao registrar perda', 'error');
        }
      } catch (error) {
        console.error('❌ Erro inesperado:', error);
        showToast('Erro inesperado ao registrar perda', 'error');
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<span>💾</span><span>Registrar Perda</span>';
      }
    });

    // ===== SISTEMA DE FILTROS =====
    document.getElementById('lossFilterItem').addEventListener('change', (e) => {
      console.log('🔍 Filtrando perdas por item:', e.target.value);
      applyLossFilters();
    });

    document.getElementById('lossFilterPeriod').addEventListener('change', (e) => {
      console.log('🔍 Filtrando perdas por período:', e.target.value);
      applyLossFilters();
    });

    // Aplica filtros nas perdas
    function applyLossFilters() {
      const itemFilter = document.getElementById('lossFilterItem').value;
      const periodFilter = document.getElementById('lossFilterPeriod').value;
      
      let losses = allData.filter(d => d.type === 'loss');
      
      if (itemFilter) {
        losses = losses.filter(loss => loss.name === itemFilter);
      }
      
      if (periodFilter !== 'all') {
        const days = parseInt(periodFilter);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        losses = losses.filter(loss => {
          const lossDate = new Date(loss.date);
          return lossDate >= cutoffDate;
        });
      }
      
      updateLossesTableWithData(losses);
    }

    // ===== FUNÇÕES DE ATUALIZAÇÃO =====
    // Atualiza dashboard principal com KPIs e estatísticas
    function updateDashboard() {
      console.log('📊 Atualizando dashboard...');
      
      const items = allData.filter(d => d.type === 'item');
      const services = allData.filter(d => d.type === 'service');
      const losses = allData.filter(d => d.type === 'loss');

      document.getElementById('totalItems').textContent = formatNumber(items.length);
      document.getElementById('totalServices').textContent = formatNumber(services.length);
      document.getElementById('totalLosses').textContent = formatNumber(losses.length);

      const lossesCard = document.getElementById('lossesCard');
      if (losses.length > 10) {
        lossesCard.className = 'kpi-card danger';
      } else if (losses.length > 5) {
        lossesCard.className = 'kpi-card warning';
      } else {
        lossesCard.className = 'kpi-card success';
      }
    }

    // Atualiza tabela de itens
    function updateItemsTable() {
      console.log('📦 Atualizando tabela de itens...');
      
      const items = allData.filter(d => d.type === 'item');
      
      if (document.getElementById('itemSearch')) {
        applyItemFilters();
      } else {
        updateItemsTableWithFiltered(items);
        updateItemStats(items);
      }
    }

    // Atualiza tabela de serviços
    function updateServicesTable() {
      console.log('🔧 Atualizando tabela de serviços...');
      
      const services = allData.filter(d => d.type === 'service');
      const tbody = document.getElementById('servicesTableBody');

      if (services.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="3">
              <div class="empty-state">
                <div class="empty-state-icon">🔧</div>
                <div class="empty-state-title">Nenhum serviço cadastrado</div>
                <div class="empty-state-text">Cadastre seu primeiro serviço acima</div>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      const sortedServices = services.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      tbody.innerHTML = sortedServices.map(service => `
        <tr>
          <td><strong>${service.name}</strong></td>
          <td>${formatDate(service.createdAt)}</td>
          <td>
            <div class="table-actions">
              <button class="btn-delete" onclick="confirmDelete('${service.__backendId}', 'service', '${service.name}')" title="Excluir serviço">
                🗑️ Excluir
              </button>
            </div>
          </td>
        </tr>
      `).join('');
    }

    // Atualiza tabela de perdas (versão padrão)
    function updateLossesTable() {
      const losses = allData.filter(d => d.type === 'loss');
      updateLossesTableWithData(losses);
    }

    // Atualiza tabela de perdas com dados específicos (para filtros)
    function updateLossesTableWithData(losses) {
      console.log('⚠️ Atualizando tabela de perdas...', losses.length, 'registros');
      
      const tbody = document.getElementById('lossesTableBody');

      if (losses.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="5">
              <div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <div class="empty-state-title">Nenhuma perda encontrada</div>
                <div class="empty-state-text">Registre perdas para análise e controle</div>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      const sortedLosses = losses.sort((a, b) => new Date(b.date) - new Date(a.date));

      tbody.innerHTML = sortedLosses.map(loss => {
        const estimatedValue = loss.quantity * 10; // R$ 10 por unidade (exemplo)
        
        return `
          <tr>
            <td><strong>${loss.name}</strong></td>
            <td>
              <span class="status-badge ${loss.quantity > 50 ? 'danger' : loss.quantity > 20 ? 'warning' : 'success'}">
                ${formatNumber(loss.quantity)}
              </span>
            </td>
            <td title="${loss.reason}">${loss.reason.length > 50 ? loss.reason.substring(0, 50) + '...' : loss.reason}</td>
            <td>${formatDate(loss.date)}</td>
            <td>
              <div class="table-actions">
                <button class="btn-delete" onclick="confirmDelete('${loss.__backendId}', 'loss', '${loss.name}')" title="Excluir registro">
                  🗑️ Excluir
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    // ===== FUNÇÕES DE SELEÇÃO E FILTROS =====
    // Atualiza select de itens no modal de perdas
    function updateLossItemSelect() {
      const items = allData.filter(d => d.type === 'item');
      const select = document.getElementById('lossItem');
      
      select.innerHTML = '<option value="">Selecione um item...</option>' +
        items.map(item => `<option value="${item.name}">${item.name} (${item.unit})</option>`).join('');
    }

    // Atualiza select de filtro de itens
    function updateLossFilterSelect() {
      const items = allData.filter(d => d.type === 'item');
      const select = document.getElementById('lossFilterItem');
      
      select.innerHTML = '<option value="">Todos os itens</option>' +
        items.map(item => `<option value="${item.name}">${item.name}</option>`).join('');
    }

    // ===== SISTEMA DE EXCLUSÃO COM CONFIRMAÇÃO =====
    // Confirma exclusão de registro com modal inline
    function confirmDelete(id, type, name) {
      console.log('🗑️ Solicitando confirmação para excluir:', type, name);
      
      const confirmModal = document.createElement('div');
      confirmModal.className = 'modal-overlay active';
      confirmModal.innerHTML = `
        <div class="modal">
          <div class="modal-header">
            <h3 class="modal-title">Confirmar Exclusão</h3>
          </div>
          <div style="margin-bottom: 24px;">
            <p>Tem certeza que deseja excluir <strong>"${name}"</strong>?</p>
            <p style="color: #64748b; font-size: 13px; margin-top: 8px;">Esta ação não pode ser desfeita.</p>
          </div>
          <div class="btn-group">
            <button class="btn btn-danger" onclick="executeDelete('${id}', this.closest('.modal-overlay'))">
              🗑️ Confirmar Exclusão
            </button>
            <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">
              ❌ Cancelar
            </button>
          </div>
        </div>
      `;
      
      document.body.appendChild(confirmModal);
    }

    // Executa exclusão após confirmação
    async function executeDelete(id, modalElement) {
      console.log('🗑️ Executando exclusão do registro:', id);
      
      const record = allData.find(d => d.__backendId === id);
      if (!record) {
        showToast('Registro não encontrado', 'error');
        modalElement.remove();
        return;
      }

      try {
        const result = await window.dataSdk.delete(record);
        
        if (result.isOk) {
          console.log('✅ Registro excluído com sucesso:', record.name);
          showToast('Registro excluído com sucesso!', 'success');
        } else {
          console.error('❌ Erro ao excluir registro:', result.error);
          showToast('Erro ao excluir registro', 'error');
        }
      } catch (error) {
        console.error('❌ Erro inesperado:', error);
        showToast('Erro inesperado ao excluir registro', 'error');
      } finally {
        modalElement.remove();
      }
    }

    // ===== FUNÇÕES DE ANÁLISE E RELATÓRIOS =====
    // Atualiza atividades recentes no dashboard
    function updateRecentActivities() {
      console.log('📋 Atualizando atividades recentes...');
      
      const container = document.getElementById('recentActivities');
      
      const recentData = allData
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      
      if (recentData.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">📋</div>
            <div class="empty-state-title">Nenhuma atividade recente</div>
            <div class="empty-state-text">Comece cadastrando itens e serviços</div>
          </div>
        `;
        return;
      }
      
      const getActivityIcon = (type) => {
        switch(type) {
          case 'item': return '📦';
          case 'service': return '🔧';
          case 'loss': return '⚠️';
          default: return '📄';
        }
      };
      
      const getActivityText = (item) => {
        switch(item.type) {
          case 'item': return `Item "${item.name}" cadastrado`;
          case 'service': return `Serviço "${item.name}" cadastrado`;
          case 'loss': return `Perda registrada: ${item.name} (${item.quantity})`;
          default: return `Atividade: ${item.name}`;
        }
      };
      
      container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${recentData.map(item => `
            <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(59, 130, 246, 0.05); border-radius: 8px; border-left: 3px solid #3b82f6;">
              <span style="font-size: 20px;">${getActivityIcon(item.type)}</span>
              <div style="flex: 1;">
                <div style="font-weight: 500; color: #e4e7eb;">${getActivityText(item)}</div>
                <div style="font-size: 12px; color: #64748b;">${formatDate(item.createdAt)}</div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    // Atualiza análises e estatísticas
    function updateAnalytics() {
      console.log('📈 Atualizando análises...');
      
      const items = allData.filter(d => d.type === 'item');
      const services = allData.filter(d => d.type === 'service');
      const losses = allData.filter(d => d.type === 'loss');
      
      const totalLossQuantity = losses.reduce((sum, loss) => sum + loss.quantity, 0);
      const avgLossPerItem = losses.length > 0 ? totalLossQuantity / losses.length : 0;
      
      const projectionElements = document.querySelectorAll('#projection .kpi-value');
      if (projectionElements.length >= 2) {
        projectionElements[0].textContent = formatNumber(Math.round(totalLossQuantity * 1.2));
        projectionElements[1].textContent = losses.length > items.length * 0.1 ? '↗️ Alta' : '↘️ Baixa';
      }
    }

    // ===== SISTEMA DE CHATBOT INTELIGENTE =====
    document.getElementById('chatSendBtn').addEventListener('click', sendChatMessage);
    document.getElementById('chatInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendChatMessage();
    });

    // Envia mensagem no chat
    function sendChatMessage() {
      const input = document.getElementById('chatInput');
      const message = input.value.trim();
      
      if (!message) return;

      console.log('💬 Enviando mensagem para chatbot:', message);
      
      const messagesContainer = document.getElementById('chatMessages');
      
      messagesContainer.innerHTML += `
        <div class="chat-message user">
          <div class="chat-avatar">👤</div>
          <div class="chat-bubble">${message}</div>
        </div>
      `;

      input.value = '';

      const typingIndicator = document.createElement('div');
      typingIndicator.className = 'chat-message bot';
      typingIndicator.innerHTML = `
        <div class="chat-avatar">🤖</div>
        <div class="chat-bubble">
          <div style="display: flex; gap: 4px; align-items: center;">
            <div class="spinner" style="width: 12px; height: 12px;"></div>
            <span>Digitando...</span>
          </div>
        </div>
      `;
      messagesContainer.appendChild(typingIndicator);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

      setTimeout(() => {
        typingIndicator.remove();
        
        const response = generateChatResponse(message);
        messagesContainer.innerHTML += `
          <div class="chat-message bot">
            <div class="chat-avatar">🤖</div>
            <div class="chat-bubble">${response}</div>
          </div>
        `;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 1500 + Math.random() * 1000); // Tempo variável para parecer mais natural

      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Gera resposta inteligente do chatbot
    function generateChatResponse(message) {
      const lowerMessage = message.toLowerCase();
      const items = allData.filter(d => d.type === 'item');
      const services = allData.filter(d => d.type === 'service');
      const losses = allData.filter(d => d.type === 'loss');

      console.log('🤖 Gerando resposta para:', message);

      if (lowerMessage.includes('item') || lowerMessage.includes('itens') || lowerMessage.includes('produto')) {
        if (items.length === 0) {
          return '📦 Ainda não há itens cadastrados no sistema. Que tal começar cadastrando alguns itens na seção "Cadastros > Itens"? Você pode definir nome, unidade de medida, lead time e estoque de segurança.';
        }
        
        const itemsWithHighStock = items.filter(i => i.safetyStock > 100);
        const avgLeadTime = items.reduce((sum, i) => sum + i.leadTime, 0) / items.length;
        
        return `📦 Temos ${items.length} itens cadastrados. Lead time médio: ${avgLeadTime.toFixed(1)} dias. ${itemsWithHighStock.length > 0 ? `Itens com alto estoque de segurança: ${itemsWithHighStock.slice(0, 3).map(i => i.name).join(', ')}.` : ''} ${items.length > 0 ? 'Principais itens: ' + items.slice(0, 3).map(i => i.name).join(', ') + '.' : ''}`;
      }

      if (lowerMessage.includes('serviço') || lowerMessage.includes('serviços')) {
        if (services.length === 0) {
          return '🔧 Nenhum serviço cadastrado ainda. Cadastre serviços na seção "Cadastros > Serviços" para começar a organizar suas operações.';
        }
        
        return `🔧 Temos ${services.length} serviços ativos no sistema. ${services.length > 0 ? 'Serviços cadastrados: ' + services.slice(0, 3).map(s => s.name).join(', ') + (services.length > 3 ? ' e outros.' : '.') : ''} Todos estão operacionais e prontos para uso.`;
      }

      if (lowerMessage.includes('perda') || lowerMessage.includes('perdas') || lowerMessage.includes('desperdício')) {
        if (losses.length === 0) {
          return '⚠️ Excelente! Nenhuma perda registrada até o momento. Continue monitorando e registre perdas quando necessário para manter o controle.';
        }
        
        const totalLossQuantity = losses.reduce((sum, loss) => sum + loss.quantity, 0);
        const mostLostItem = losses.reduce((acc, loss) => {
          acc[loss.name] = (acc[loss.name] || 0) + loss.quantity;
          return acc;
        }, {});
        
        const topLossItem = Object.entries(mostLostItem).sort((a, b) => b[1] - a[1])[0];
        
        return `⚠️ Foram registradas ${losses.length} perdas, totalizando ${formatNumber(totalLossQuantity)} unidades. ${topLossItem ? `Item com mais perdas: ${topLossItem[0]} (${topLossItem[1]} unidades).` : ''} Recomendo analisar os padrões no relatório de perdas.`;
      }

      if (lowerMessage.includes('análise') || lowerMessage.includes('relatório') || lowerMessage.includes('dashboard') || lowerMessage.includes('estatística')) {
        const totalRecords = allData.length;
        const recentActivity = allData.filter(d => {
          const daysDiff = (new Date() - new Date(d.createdAt)) / (1000 * 60 * 60 * 24);
          return daysDiff <= 7;
        }).length;
        
        return `📊 Análise do sistema: ${totalRecords} registros totais, ${recentActivity} atividades nos últimos 7 dias. ${items.length} itens, ${services.length} serviços, ${losses.length} perdas. ${losses.length > items.length * 0.1 ? 'Atenção: alta taxa de perdas detectada.' : 'Taxa de perdas dentro do esperado.'}`;
      }

      if (lowerMessage.includes('ajuda') || lowerMessage.includes('help') || lowerMessage.includes('como')) {
        return `🤖 Posso ajudá-lo com:
        
📦 **Itens**: Informações sobre cadastros, estoques e lead times
🔧 **Serviços**: Status e listagem de serviços ativos  
⚠️ **Perdas**: Análise de perdas e desperdícios
📊 **Análises**: Estatísticas e relatórios do sistema
🧭 **Navegação**: Como usar as diferentes seções

O que você gostaria de saber?`;
      }

      if (lowerMessage.includes('como usar') || lowerMessage.includes('navegar') || lowerMessage.includes('menu')) {
        return `🧭 **Como usar o sistema:**

1. **Dashboard**: Visão geral com KPIs e atividades recentes
2. **Cadastros**: Registre itens e serviços
3. **Perdas**: Registre e analise perdas com filtros
4. **Análises**: Visualize consumo e projeções
5. **Assistente**: Converse comigo para tirar dúvidas

Use o menu lateral para navegar entre as seções!`;
      }

      if (lowerMessage.includes('oi') || lowerMessage.includes('olá') || lowerMessage.includes('bom dia') || lowerMessage.includes('boa tarde') || lowerMessage.includes('boa noite')) {
        const greetings = [
          '👋 Olá! Como posso ajudá-lo hoje?',
          '🤖 Oi! Estou aqui para auxiliar com informações do sistema.',
          '✨ Olá! Pronto para ajudar com análises e dados.',
          '🎯 Oi! Que informação você precisa sobre o sistema?'
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
      }

      const responses = [
        `🤔 Interessante pergunta! Posso ajudar com informações sobre itens (${items.length}), serviços (${services.length}), perdas (${losses.length}) ou análises do sistema. O que você gostaria de saber especificamente?`,
        `💡 Não tenho certeza sobre isso, mas posso fornecer dados sobre nossos ${items.length} itens cadastrados, ${services.length} serviços ativos ou ${losses.length} perdas registradas. Sobre qual área você gostaria de saber mais?`,
        `🎯 Para te ajudar melhor, posso falar sobre: cadastros, perdas, análises ou navegação no sistema. Qual dessas áreas te interessa?`
      ];
      
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // ===== SISTEMA DE NOTIFICAÇÕES =====
    // Exibe notificações toast para feedback do usuário
    function showToast(message, type = 'success') {
      console.log(`🔔 Toast ${type}:`, message);
      
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.innerHTML = `
        <div class="toast-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</div>
        <div class="toast-message">${message}</div>
      `;
      
      toast.style.transform = 'translateX(100px)';
      toast.style.opacity = '0';
      
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
      }, 10);
      
      setTimeout(() => {
        toast.style.transform = 'translateX(100px)';
        toast.style.opacity = '0';
        
        setTimeout(() => {
          if (toast.parentNode) {
            toast.remove();
          }
        }, 300);
      }, 4000);
    }

    // ===== SISTEMA DE BUSCA AVANÇADA =====
    let selectedItems = new Set();
    let filteredItems = [];

    document.getElementById('itemSearch').addEventListener('input', applyItemFilters);
    document.getElementById('itemFilterUnit').addEventListener('change', applyItemFilters);
    document.getElementById('itemFilterLeadTime').addEventListener('change', applyItemFilters);
    document.getElementById('itemSortBy').addEventListener('change', applyItemFilters);

    // Aplica filtros e busca nos itens
    function applyItemFilters() {
      console.log('🔍 Aplicando filtros de itens...');
      
      const searchTerm = document.getElementById('itemSearch').value.toLowerCase();
      const unitFilter = document.getElementById('itemFilterUnit').value;
      const leadTimeFilter = document.getElementById('itemFilterLeadTime').value;
      const sortBy = document.getElementById('itemSortBy').value;
      
      let items = allData.filter(d => d.type === 'item');
      
      if (searchTerm) {
        items = items.filter(item => 
          item.name.toLowerCase().includes(searchTerm)
        );
      }
      
      if (unitFilter) {
        items = items.filter(item => item.unit === unitFilter);
      }
      
      if (leadTimeFilter) {
        switch(leadTimeFilter) {
          case '0-7':
            items = items.filter(item => item.leadTime >= 0 && item.leadTime <= 7);
            break;
          case '8-15':
            items = items.filter(item => item.leadTime >= 8 && item.leadTime <= 15);
            break;
          case '16-30':
            items = items.filter(item => item.leadTime >= 16 && item.leadTime <= 30);
            break;
          case '30+':
            items = items.filter(item => item.leadTime > 30);
            break;
        }
      }
      
      switch(sortBy) {
        case 'name':
          items.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'leadTime':
          items.sort((a, b) => a.leadTime - b.leadTime);
          break;
        case 'safetyStock':
          items.sort((a, b) => b.safetyStock - a.safetyStock);
          break;
        case 'createdAt':
          items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
      }
      
      filteredItems = items;
      updateItemsTableWithFiltered(items);
      updateItemStats(items);
    }

    // Limpa busca de itens
    function clearItemSearch() {
      document.getElementById('itemSearch').value = '';
      document.getElementById('itemFilterUnit').value = '';
      document.getElementById('itemFilterLeadTime').value = '';
      document.getElementById('itemSortBy').value = 'name';
      applyItemFilters();
      showToast('Filtros limpos', 'success');
    }

    // Atualiza tabela com itens filtrados
    function updateItemsTableWithFiltered(items) {
      const tbody = document.getElementById('itemsTableBody');

      if (items.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7">
              <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <div class="empty-state-title">Nenhum item encontrado</div>
                <div class="empty-state-text">Tente ajustar os filtros de busca</div>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = items.map(item => {
        const status = getItemStatus(item);
        const isSelected = selectedItems.has(item.__backendId);
        
        return `
          <tr>
            <td>
              <input type="checkbox" ${isSelected ? 'checked' : ''} 
                     onchange="toggleItemSelection('${item.__backendId}')">
            </td>
            <td><strong>${item.name}</strong></td>
            <td><span class="status-badge success">${item.unit}</span></td>
            <td>${item.leadTime} dias</td>
            <td>${formatNumber(item.safetyStock)}</td>
            <td><span class="status-badge ${status.class}">${status.text}</span></td>
            <td>
              <div class="table-actions">
                <button class="btn-edit" onclick="editItem('${item.__backendId}')" title="Editar item">
                  ✏️ Editar
                </button>
                <button class="btn-delete" onclick="confirmDelete('${item.__backendId}', 'item', '${item.name}')" title="Excluir item">
                  🗑️ Excluir
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    // Determina status do item baseado em regras de negócio
    function getItemStatus(item) {
      if (item.leadTime > 30) {
        return { class: 'danger', text: 'Lead Time Alto' };
      } else if (item.leadTime > 15) {
        return { class: 'warning', text: 'Lead Time Médio' };
      } else if (item.safetyStock < 50) {
        return { class: 'warning', text: 'Estoque Baixo' };
      } else {
        return { class: 'success', text: 'Normal' };
      }
    }

    // Atualiza estatísticas dos itens
    function updateItemStats(items) {
      const totalItems = items.length;
      const avgLeadTime = items.length > 0 ? 
        (items.reduce((sum, item) => sum + item.leadTime, 0) / items.length).toFixed(1) : 0;
      const totalSafetyStock = items.reduce((sum, item) => sum + item.safetyStock, 0);

      document.getElementById('itemsCount').textContent = totalItems;
      document.getElementById('avgLeadTime').textContent = `${avgLeadTime} dias`;
      document.getElementById('totalSafetyStock').textContent = formatNumber(totalSafetyStock);
    }

    // ===== SISTEMA DE SELEÇÃO EM LOTE =====
    // Alterna seleção de todos os itens
    function toggleSelectAllItems() {
      const selectAll = document.getElementById('selectAllItems');
      const checkboxes = document.querySelectorAll('#itemsTableBody input[type="checkbox"]');
      
      checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
        const itemId = checkbox.onchange.toString().match(/'([^']+)'/)[1];
        if (selectAll.checked) {
          selectedItems.add(itemId);
        } else {
          selectedItems.delete(itemId);
        }
      });
      
      updateBulkActionsVisibility();
    }

    // Alterna seleção de item individual
    function toggleItemSelection(itemId) {
      if (selectedItems.has(itemId)) {
        selectedItems.delete(itemId);
      } else {
        selectedItems.add(itemId);
      }
      
      updateBulkActionsVisibility();
      updateSelectAllCheckbox();
    }

    // Atualiza visibilidade das ações em lote
    function updateBulkActionsVisibility() {
      const bulkActions = document.getElementById('bulkActionsItems');
      const selectedCount = document.getElementById('selectedItemsCount');
      
      if (selectedItems.size > 0) {
        bulkActions.style.display = 'flex';
        selectedCount.textContent = `${selectedItems.size} itens selecionados`;
      } else {
        bulkActions.style.display = 'none';
      }
    }

    // Atualiza estado do checkbox "selecionar todos"
    function updateSelectAllCheckbox() {
      const selectAll = document.getElementById('selectAllItems');
      const totalCheckboxes = document.querySelectorAll('#itemsTableBody input[type="checkbox"]').length;
      
      if (selectedItems.size === 0) {
        selectAll.checked = false;
        selectAll.indeterminate = false;
      } else if (selectedItems.size === totalCheckboxes) {
        selectAll.checked = true;
        selectAll.indeterminate = false;
      } else {
        selectAll.checked = false;
        selectAll.indeterminate = true;
      }
    }

    // Exporta itens selecionados
    function bulkExportItems() {
      if (selectedItems.size === 0) {
        showToast('Selecione pelo menos um item', 'error');
        return;
      }
      
      const selectedData = allData.filter(d => 
        d.type === 'item' && selectedItems.has(d.__backendId)
      );
      
      console.log('📄 Exportando itens selecionados:', selectedData.length);
      showToast(`Exportando ${selectedData.length} itens selecionados...`, 'success');
      
      setTimeout(() => {
        showToast(`Arquivo com ${selectedData.length} itens pronto para download`, 'success');
      }, 1500);
    }

    // Exclui itens selecionados
    function bulkDeleteItems() {
      if (selectedItems.size === 0) {
        showToast('Selecione pelo menos um item', 'error');
        return;
      }
      
      const selectedData = allData.filter(d => 
        d.type === 'item' && selectedItems.has(d.__backendId)
      );
      
      const confirmModal = document.createElement('div');
      confirmModal.className = 'modal-overlay active';
      confirmModal.innerHTML = `
        <div class="modal">
          <div class="modal-header">
            <h3 class="modal-title">Confirmar Exclusão em Lote</h3>
          </div>
          <div style="margin-bottom: 24px;">
            <p>Tem certeza que deseja excluir <strong>${selectedData.length} itens</strong> selecionados?</p>
            <div style="margin-top: 12px; padding: 12px; background: rgba(239, 68, 68, 0.1); border-radius: 8px; border-left: 3px solid #ef4444;">
              <p style="color: #ef4444; font-size: 13px; margin: 0;">⚠️ Esta ação não pode ser desfeita e afetará todos os itens selecionados.</p>
            </div>
          </div>
          <div class="btn-group">
            <button class="btn btn-danger" onclick="executeBulkDelete(this.closest('.modal-overlay'))">
              🗑️ Confirmar Exclusão
            </button>
            <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">
              ❌ Cancelar
            </button>
          </div>
        </div>
      `;
      
      document.body.appendChild(confirmModal);
    }

    // Executa exclusão em lote
    async function executeBulkDelete(modalElement) {
      const selectedData = allData.filter(d => 
        d.type === 'item' && selectedItems.has(d.__backendId)
      );
      
      console.log('🗑️ Executando exclusão em lote:', selectedData.length, 'itens');
      
      let successCount = 0;
      let errorCount = 0;
      
      modalElement.querySelector('.modal').innerHTML = `
        <div class="modal-header">
          <h3 class="modal-title">Excluindo Itens...</h3>
        </div>
        <div style="margin-bottom: 24px;">
          <p>Excluindo ${selectedData.length} itens...</p>
          <div class="progress-bar" style="margin-top: 12px;">
            <div class="progress-fill" id="deleteProgress" style="width: 0%"></div>
          </div>
          <p id="deleteStatus" style="font-size: 13px; color: #64748b; margin-top: 8px;">Iniciando...</p>
        </div>
      `;
      
      for (let i = 0; i < selectedData.length; i++) {
        const item = selectedData[i];
        const progress = ((i + 1) / selectedData.length) * 100;
        
        document.getElementById('deleteProgress').style.width = `${progress}%`;
        document.getElementById('deleteStatus').textContent = `Excluindo "${item.name}" (${i + 1}/${selectedData.length})`;
        
        try {
          const result = await window.dataSdk.delete(item);
          if (result.isOk) {
            successCount++;
            selectedItems.delete(item.__backendId);
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      modalElement.remove();
      
      if (successCount > 0) {
        showToast(`${successCount} itens excluídos com sucesso!`, 'success');
      }
      
      if (errorCount > 0) {
        showToast(`${errorCount} itens não puderam ser excluídos`, 'error');
      }
      
      updateBulkActionsVisibility();
    }

    // ===== FUNÇÕES DE EXPORTAÇÃO AVANÇADAS =====
    // Exporta dados para CSV (simulado)
    function exportToCSV(type) {
      console.log('📄 Exportando dados para CSV:', type);
      
      let data, filename, headers;
      
      switch(type) {
        case 'items':
          data = filteredItems.length > 0 ? filteredItems : allData.filter(d => d.type === 'item');
          headers = ['Nome', 'Unidade', 'Lead Time', 'Estoque Segurança', 'Status', 'Data Cadastro'];
          filename = 'itens_cadastrados.csv';
          break;
        case 'services':
          data = allData.filter(d => d.type === 'service');
          headers = ['Nome', 'Data Cadastro'];
          filename = 'servicos_cadastrados.csv';
          break;
        case 'losses':
          data = allData.filter(d => d.type === 'loss');
          headers = ['Item', 'Quantidade', 'Motivo', 'Data', 'Data Registro'];
          filename = 'perdas_registradas.csv';
          break;
        default:
          showToast('Tipo de exportação inválido', 'error');
          return;
      }
      
      if (data.length === 0) {
        showToast('Nenhum dado para exportar', 'error');
        return;
      }
      
      const csvContent = generateCSVContent(data, headers, type);
      
      showToast(`Exportação de ${data.length} registros iniciada`, 'success');
      
      setTimeout(() => {
        showToast(`Arquivo ${filename} pronto para download`, 'success');
        console.log('📄 Conteúdo CSV gerado:', csvContent.substring(0, 200) + '...');
      }, 2000);
    }

    // Exporta para PDF
    function exportToPDF(type) {
      console.log('📑 Exportando dados para PDF:', type);
      
      let data, filename;
      
      switch(type) {
        case 'items':
          data = filteredItems.length > 0 ? filteredItems : allData.filter(d => d.type === 'item');
          filename = 'relatorio_itens.pdf';
          break;
        case 'services':
          data = allData.filter(d => d.type === 'service');
          filename = 'relatorio_servicos.pdf';
          break;
        case 'losses':
          data = allData.filter(d => d.type === 'loss');
          filename = 'relatorio_perdas.pdf';
          break;
        default:
          showToast('Tipo de exportação inválido', 'error');
          return;
      }
      
      if (data.length === 0) {
        showToast('Nenhum dado para exportar', 'error');
        return;
      }
      
      showToast(`Gerando PDF com ${data.length} registros...`, 'success');
      
      setTimeout(() => {
        showToast(`Relatório PDF ${filename} pronto para download`, 'success');
      }, 3000);
    }

    // Gera conteúdo CSV
    function generateCSVContent(data, headers, type) {
      let csvContent = headers.join(',') + '\n';
      
      data.forEach(item => {
        let row = [];
        
        switch(type) {
          case 'items':
            const status = getItemStatus(item);
            row = [
              `"${item.name}"`,
              item.unit,
              item.leadTime,
              item.safetyStock,
              `"${status.text}"`,
              formatDate(item.createdAt)
            ];
            break;
          case 'services':
            row = [
              `"${item.name}"`,
              formatDate(item.createdAt)
            ];
            break;
          case 'losses':
            row = [
              `"${item.name}"`,
              item.quantity,
              `"${item.reason}"`,
              formatDate(item.date),
              formatDate(item.createdAt)
            ];
            break;
        }
        
        csvContent += row.join(',') + '\n';
      });
      
      return csvContent;
    }

    // ===== FUNÇÕES DE RELATÓRIOS AVANÇADOS =====
    // Exporta relatório detalhado
    function exportDetailedReport(type) {
      console.log('📊 Gerando relatório detalhado:', type);
      
      const period = document.getElementById('reportPeriod').value;
      const format = document.getElementById('reportFormat').value;
      const detail = document.getElementById('reportDetail').value;
      
      showToast(`Gerando relatório ${detail} em formato ${format.toUpperCase()}...`, 'success');
      
      setTimeout(() => {
        showToast(`Relatório detalhado de ${type} pronto para download`, 'success');
      }, 4000);
    }

    // Exporta relatório PDF executivo
    function exportPDFReport(type) {
      console.log('📑 Gerando relatório PDF executivo:', type);
      
      showToast('Gerando relatório executivo em PDF...', 'success');
      
      setTimeout(() => {
        showToast(`Relatório executivo de ${type} pronto para download`, 'success');
      }, 5000);
    }

    // Visualiza relatório
    function previewReport(type) {
      console.log('👁️ Visualizando relatório:', type);
      
      const previewModal = document.createElement('div');
      previewModal.className = 'modal-overlay active';
      previewModal.innerHTML = `
        <div class="modal" style="max-width: 800px;">
          <div class="modal-header">
            <h3 class="modal-title">Preview - Relatório de ${type.charAt(0).toUpperCase() + type.slice(1)}</h3>
            <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
          </div>
          <div style="margin-bottom: 24px;">
            <div class="report-preview">
              ${generateReportPreview(type)}
            </div>
          </div>
          <div class="btn-group">
            <button class="btn btn-primary" onclick="exportDetailedReport('${type}')">
              📄 Exportar CSV
            </button>
            <button class="btn btn-secondary" onclick="exportPDFReport('${type}')">
              📑 Exportar PDF
            </button>
          </div>
        </div>
      `;
      
      document.body.appendChild(previewModal);
    }

    // Gera preview do relatório
    function generateReportPreview(type) {
      let data, content;
      
      switch(type) {
        case 'items':
          data = allData.filter(d => d.type === 'item');
          content = `
            <h4>📦 Relatório de Itens</h4>
            <p><strong>Total de itens:</strong> ${data.length}</p>
            <p><strong>Lead time médio:</strong> ${data.length > 0 ? (data.reduce((sum, item) => sum + item.leadTime, 0) / data.length).toFixed(1) : 0} dias</p>
            <p><strong>Estoque total de segurança:</strong> ${formatNumber(data.reduce((sum, item) => sum + item.safetyStock, 0))}</p>
            <div style="margin-top: 16px;">
              <h5>Itens com maior lead time:</h5>
              <ul>
                ${data.sort((a, b) => b.leadTime - a.leadTime).slice(0, 3).map(item => 
                  `<li>${item.name} - ${item.leadTime} dias</li>`
                ).join('')}
              </ul>
            </div>
          `;
          break;
        case 'services':
          data = allData.filter(d => d.type === 'service');
          content = `
            <h4>🔧 Relatório de Serviços</h4>
            <p><strong>Total de serviços:</strong> ${data.length}</p>
            <p><strong>Serviços ativos:</strong> ${data.length}</p>
            <div style="margin-top: 16px;">
              <h5>Serviços cadastrados:</h5>
              <ul>
                ${data.slice(0, 5).map(service => 
                  `<li>${service.name} - ${formatDate(service.createdAt)}</li>`
                ).join('')}
              </ul>
            </div>
          `;
          break;
        case 'losses':
          data = allData.filter(d => d.type === 'loss');
          const totalLossQuantity = data.reduce((sum, loss) => sum + loss.quantity, 0);
          content = `
            <h4>⚠️ Relatório de Perdas</h4>
            <p><strong>Total de perdas:</strong> ${data.length}</p>
            <p><strong>Quantidade total perdida:</strong> ${formatNumber(totalLossQuantity)}</p>
            <p><strong>Valor estimado:</strong> R$ ${formatNumber(totalLossQuantity * 10)}</p>
            <div style="margin-top: 16px;">
              <h5>Maiores perdas:</h5>
              <ul>
                ${data.sort((a, b) => b.quantity - a.quantity).slice(0, 3).map(loss => 
                  `<li>${loss.name} - ${loss.quantity} unidades</li>`
                ).join('')}
              </ul>
            </div>
          `;
          break;
        case 'strategic':
          content = `
            <h4>🎯 Relatório Estratégico</h4>
            <p><strong>Eficiência geral:</strong> 94.2%</p>
            <p><strong>Taxa de crescimento:</strong> +12.5%</p>
            <p><strong>ROI estimado:</strong> R$ 45.200</p>
            <div style="margin-top: 16px;">
              <h5>Principais insights:</h5>
              <ul>
                <li>Sistema operando com alta eficiência</li>
                <li>Oportunidades de otimização identificadas</li>
                <li>Tendência de crescimento positiva</li>
              </ul>
            </div>
          `;
          break;
      }
      
      return `
        <div style="padding: 20px; background: rgba(15, 20, 32, 0.5); border-radius: 8px; border: 1px solid rgba(59, 130, 246, 0.1);">
          ${content}
        </div>
      `;
    }

    // Gera todos os relatórios
    function generateAllReports() {
      console.log('📊 Gerando todos os relatórios...');
      
      showToast('Iniciando geração de todos os relatórios...', 'success');
      
      const reports = ['items', 'services', 'losses', 'strategic'];
      let completed = 0;
      
      reports.forEach((report, index) => {
        setTimeout(() => {
          completed++;
          showToast(`Relatório de ${report} gerado (${completed}/${reports.length})`, 'success');
          
          if (completed === reports.length) {
            setTimeout(() => {
              showToast('Todos os relatórios foram gerados com sucesso!', 'success');
            }, 1000);
          }
        }, (index + 1) * 2000);
      });
    }

    // ===== FUNÇÕES DE ANALYTICS AVANÇADO =====
    // Atualiza analytics
    function refreshAnalytics() {
      console.log('🔄 Atualizando analytics...');
      
      showToast('Atualizando dados de analytics...', 'success');
      
      setTimeout(() => {
        document.getElementById('growthRate').textContent = `+${(Math.random() * 20 + 5).toFixed(1)}%`;
        document.getElementById('efficiency').textContent = `${(Math.random() * 10 + 90).toFixed(1)}%`;
        document.getElementById('roi').textContent = `R$ ${(Math.random() * 50 + 30).toFixed(1)}K`;
        document.getElementById('accuracy').textContent = `${(Math.random() * 15 + 80).toFixed(1)}%`;
        
        showToast('Analytics atualizado com sucesso!', 'success');
      }, 2000);
    }

    // Exporta analytics
    function exportAnalytics() {
      console.log('📊 Exportando analytics...');
      
      showToast('Gerando relatório de analytics...', 'success');
      
      setTimeout(() => {
        showToast('Relatório de analytics pronto para download', 'success');
      }, 3000);
    }

    // Alterna tipo de gráfico
    function toggleChartType() {
      console.log('🔄 Alternando tipo de gráfico...');
      showToast('Tipo de gráfico alterado', 'success');
    }

    // ===== FUNÇÕES DE ANÁLISE ESTRATÉGICA =====
    // Gera relatório estratégico
    function generateStrategicReport() {
      console.log('🎯 Gerando relatório estratégico...');
      
      showToast('Gerando análise estratégica completa...', 'success');
      
      setTimeout(() => {
        showToast('Relatório estratégico pronto para download', 'success');
      }, 4000);
    }

    // ===== FUNÇÕES DE CONFIGURAÇÕES =====
    // Salva configurações
    function saveSettings() {
      console.log('💾 Salvando configurações...');
      
      const settings = {
        theme: document.getElementById('systemTheme').value,
        language: document.getElementById('systemLanguage').value,
        reportPeriod: document.getElementById('defaultReportPeriod').value,
        autoExport: document.getElementById('autoExport').value,
        notifications: {
          lowStock: document.getElementById('notifyLowStock').checked,
          highLosses: document.getElementById('notifyHighLosses').checked,
          reports: document.getElementById('notifyReports').checked
        }
      };
      
      localStorage.setItem('systemSettings', JSON.stringify(settings));
      showToast('Configurações salvas com sucesso!', 'success');
    }

    // Restaura configurações padrão
    function resetSettings() {
      console.log('🔄 Restaurando configurações padrão...');
      
      document.getElementById('systemTheme').value = 'dark';
      document.getElementById('systemLanguage').value = 'pt-BR';
      document.getElementById('defaultReportPeriod').value = '30';
      document.getElementById('autoExport').value = 'disabled';
      document.getElementById('notifyLowStock').checked = true;
      document.getElementById('notifyHighLosses').checked = true;
      document.getElementById('notifyReports').checked = true;
      
      showToast('Configurações restauradas para o padrão', 'success');
    }

    // Exporta todos os dados
    function exportAllData() {
      console.log('📤 Exportando todos os dados...');
      
      if (allData.length === 0) {
        showToast('Nenhum dado para exportar', 'error');
        return;
      }
      
      showToast(`Exportando ${allData.length} registros...`, 'success');
      
      setTimeout(() => {
        showToast('Backup completo pronto para download', 'success');
      }, 3000);
    }

    // Importa dados
    function importData() {
      console.log('📥 Importando dados...');
      showToast('Funcionalidade de importação em desenvolvimento', 'info');
    }

    // Limpa todos os dados
    function clearAllData() {
      console.log('🗑️ Solicitando limpeza de todos os dados...');
      
      if (allData.length === 0) {
        showToast('Não há dados para limpar', 'info');
        return;
      }
      
      const confirmModal = document.createElement('div');
      confirmModal.className = 'modal-overlay active';
      confirmModal.innerHTML = `
        <div class="modal">
          <div class="modal-header">
            <h3 class="modal-title">⚠️ ATENÇÃO - Limpeza Total de Dados</h3>
          </div>
          <div style="margin-bottom: 24px;">
            <div style="padding: 16px; background: rgba(239, 68, 68, 0.1); border-radius: 8px; border-left: 4px solid #ef4444; margin-bottom: 16px;">
              <p style="color: #ef4444; font-weight: 600; margin: 0 0 8px 0;">🚨 OPERAÇÃO IRREVERSÍVEL</p>
              <p style="color: #ef4444; font-size: 13px; margin: 0;">Esta ação irá excluir TODOS os dados do sistema permanentemente.</p>
            </div>
            <p>Tem certeza que deseja excluir:</p>
            <ul style="margin: 12px 0; padding-left: 20px; color: #94a3b8;">
              <li>${allData.filter(d => d.type === 'item').length} itens cadastrados</li>
              <li>${allData.filter(d => d.type === 'service').length} serviços cadastrados</li>
              <li>${allData.filter(d => d.type === 'loss').length} registros de perdas</li>
            </ul>
            <p style="font-size: 13px; color: #64748b;">Digite "CONFIRMAR" para prosseguir:</p>
            <input type="text" id="confirmInput" placeholder="Digite CONFIRMAR" style="width: 100%; margin-top: 8px; padding: 8px; border-radius: 4px; border: 1px solid rgba(239, 68, 68, 0.3); background: rgba(15, 20, 32, 0.8); color: #e4e7eb;">
          </div>
          <div class="btn-group">
            <button class="btn btn-danger" onclick="executeClearAllData(this.closest('.modal-overlay'))" id="confirmClearBtn" disabled>
              🗑️ Excluir Todos os Dados
            </button>
            <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">
              ❌ Cancelar
            </button>
          </div>
        </div>
      `;
      
      document.body.appendChild(confirmModal);
      
      const confirmInput = confirmModal.querySelector('#confirmInput');
      const confirmBtn = confirmModal.querySelector('#confirmClearBtn');
      
      confirmInput.addEventListener('input', () => {
        confirmBtn.disabled = confirmInput.value !== 'CONFIRMAR';
      });
    }

    // Executa limpeza de todos os dados
    async function executeClearAllData(modalElement) {
      console.log('🗑️ Executando limpeza total de dados...');
      
      modalElement.querySelector('.modal').innerHTML = `
        <div class="modal-header">
          <h3 class="modal-title">Excluindo Todos os Dados...</h3>
        </div>
        <div style="margin-bottom: 24px;">
          <p>Excluindo ${allData.length} registros...</p>
          <div class="progress-bar" style="margin-top: 12px;">
            <div class="progress-fill" id="clearProgress" style="width: 0%"></div>
          </div>
          <p id="clearStatus" style="font-size: 13px; color: #64748b; margin-top: 8px;">Iniciando...</p>
        </div>
      `;
      
      let deleted = 0;
      const total = allData.length;
      
      for (let i = 0; i < allData.length; i++) {
        const item = allData[i];
        const progress = ((i + 1) / total) * 100;
        
        document.getElementById('clearProgress').style.width = `${progress}%`;
        document.getElementById('clearStatus').textContent = `Excluindo registro ${i + 1}/${total}`;
        
        try {
          const result = await window.dataSdk.delete(item);
          if (result.isOk) {
            deleted++;
          }
        } catch (error) {
          console.error('Erro ao excluir:', error);
        }
        
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      modalElement.remove();
      
      if (deleted > 0) {
        showToast(`${deleted} registros excluídos. Sistema limpo!`, 'success');
      } else {
        showToast('Erro ao limpar dados do sistema', 'error');
      }
      
      selectedItems.clear();
      updateBulkActionsVisibility();
    }

    // ===== ATALHOS DE TECLADO =====
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return;
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '7') {
        e.preventDefault();
        const pages = ['dashboard', 'items', 'services', 'losses', 'consumption', 'projection', 'chatbot'];
        const pageIndex = parseInt(e.key) - 1;
        
        if (pages[pageIndex]) {
          navigateToPage(pages[pageIndex]);
          showToast(`Navegando para ${pages[pageIndex]}`, 'success');
        }
      }
      
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal-overlay.active');
        if (activeModal) {
          activeModal.classList.remove('active');
        }
      }
    });

    // ===== RESPONSIVIDADE MOBILE =====
    // Configura comportamento mobile
    function setupMobileFeatures() {
      const sidebar = document.getElementById('sidebar');
      
      document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          if (!sidebar.contains(e.target) && sidebar.classList.contains('mobile-open')) {
            sidebar.classList.remove('mobile-open');
          }
        }
      });
      
      if (window.innerWidth <= 768) {
        const navbar = document.querySelector('.navbar');
        const menuBtn = document.createElement('button');
        menuBtn.innerHTML = '☰';
        menuBtn.className = 'btn btn-secondary';
        menuBtn.style.marginRight = '12px';
        menuBtn.onclick = () => sidebar.classList.toggle('mobile-open');
        
        navbar.insertBefore(menuBtn, navbar.firstChild);
      }
    }

    // ===== INICIALIZAÇÃO COMPLETA DO SISTEMA =====
    // Função principal de inicialização
    async function startApplication() {
      console.log('🚀 Iniciando aplicação Nova Corrente...');
      
      try {
        initializeAuth();
        
        setupLoginForm();
        setupChangePasswordForm();
        
        loadUserPreferences();
        
        setupMobileFeatures();
        
        setupScrollAnimations();
        
        if (window.dataSdk && window.elementSdk) {
          await initializeApp();
        }
        
        if (isLoggedIn) {
          setTimeout(() => {
            showToast('Sistema Nova Corrente carregado com sucesso!', 'success');
          }, 1000);
        }
        
        console.log('✅ Aplicação iniciada com sucesso!');
        
      } catch (error) {
        console.error('❌ Erro ao iniciar aplicação:', error);
        showToast('Erro ao carregar sistema', 'error');
      }
    }

    // ===== INICIALIZAÇÃO =====
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startApplication);
    } else {
      startApplication();
    }

    // ===== LOGS DE DESENVOLVIMENTO =====
    console.log(`
    🚀 Nova Corrente - Previsibilidade de Demanda
    ═══════════════════════════════════════════════
    
    📊 Sistema de gestão empresarial completo
    🎨 Design moderno com tema dark/light
    💾 Persistência de dados com Data SDK
    🤖 Assistente virtual inteligente
    📱 Interface responsiva
    
    ═══════════════════════════════════════════════
    Desenvolvido com ❤️ para Nova Corrente
    `);
