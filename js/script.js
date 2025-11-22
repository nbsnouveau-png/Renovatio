// ===== КОНФИГУРАЦИЯ =====
const CONFIG = {
    scrollOffset: 70,
    animationDelay: 50,
    mobileBreakpoint: 768
};

// ===== ФИЛЬТРАЦИЯ ПОРТФОЛИО =====
function initPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-buttons .btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    // Проверка элементов
    if (!filterButtons.length || !portfolioItems.length) {
        console.warn('Элементы фильтрации портфолио не найдены');
        return;
    }

    function handleFilterClick(e) {
        const button = e.currentTarget;
        const filterValue = button.dataset.filter;

        // Сброс активного состояния
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Фильтрация элементов
        portfolioItems.forEach(item => {
            setTimeout(() => {
                const shouldShow = filterValue === 'all' || item.dataset.category === filterValue;
                
                if (shouldShow) {
                    item.classList.remove('hidden');
                    item.style.display = 'block';
                } else {
                    item.classList.add('hidden');
                    item.style.display = 'none';
                }
            }, CONFIG.animationDelay);
        });
    }

    // Назначение обработчиков
    filterButtons.forEach(button => {
        button.addEventListener('click', handleFilterClick);
    });
}

// ===== ОБРАБОТКА ФОРМ =====
function initForms() {
    // Быстрая форма связи
    const quickForm = document.getElementById('quickContactForm');
    if (quickForm) {
        quickForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Валидация формы
            if (validateForm(this)) {
                // Имитация отправки
                showNotification('Заявка отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
                this.reset();
            }
        });
    }

    // Модальная форма расчета
    const calculationForm = document.getElementById('calculationForm');
    if (calculationForm) {
        calculationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                showNotification('Заявка отправлена! Мы свяжемся с вами в течение 15 минут.', 'success');
                this.reset();
                
                // Закрытие модального окна
                const modal = bootstrap.Modal.getInstance(document.getElementById('calculationModal'));
                if (modal) modal.hide();
            }
        });
    }
}

// ===== ВАЛИДАЦИЯ ФОРМ =====
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            markInvalid(input, 'Это поле обязательно для заполнения');
            isValid = false;
        } else {
            markValid(input);
        }

        // Специфичная валидация для телефона
        if (input.type === 'tel' && input.value.trim()) {
            if (!isValidPhone(input.value)) {
                markInvalid(input, 'Введите корректный номер телефона');
                isValid = false;
            }
        }
    });

    // Валидация чекбокса
    const checkbox = form.querySelector('input[type="checkbox"][required]');
    if (checkbox && !checkbox.checked) {
        markInvalid(checkbox, 'Необходимо согласие на обработку данных');
        isValid = false;
    }

    return isValid;
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[7-8]?[0-9\s\-\(\)]{10,15}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
}

function markInvalid(input, message) {
    input.classList.add('is-invalid');
    
    // Удаляем старую ошибку
    const existingError = input.parentNode.querySelector('.invalid-feedback');
    if (existingError) existingError.remove();
    
    // Добавляем новую ошибку
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    input.parentNode.appendChild(errorDiv);
}

function markValid(input) {
    input.classList.remove('is-invalid');
    const errorDiv = input.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) errorDiv.remove();
}

// ===== ПЛАВНАЯ ПРОКРУТКА =====
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    if (!links.length) {
        console.warn('Якорные ссылки не найдены');
        return;
    }

    function handleLinkClick(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (!targetElement) {
            console.warn(`Элемент с id "${targetId}" не найден`);
            return;
        }

        const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - CONFIG.scrollOffset;
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });

        // Закрытие мобильного меню
        closeMobileMenu();
    }

    links.forEach(link => {
        link.addEventListener('click', handleLinkClick);
    });
}

function closeMobileMenu() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarCollapse && navbarCollapse.classList.contains('show') && navbarToggler) {
        navbarToggler.click();
    }
}

// ===== УВЕДОМЛЕНИЯ =====
function showNotification(message, type = 'info') {
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
    `;
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Автоматическое скрытие
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
function init() {
    try {
        initPortfolioFilters();
        initForms();
        initSmoothScroll();
        
        console.log('Все модули инициализированы успешно');
    } catch (error) {
        console.error('Ошибка при инициализации:', error);
    }
}

// ===== ЗАПУСК ПРИ ЗАГРУЗКЕ =====
document.addEventListener('DOMContentLoaded', init);

// ===== ОБРАБОТЧИКИ ОШИБОК =====
window.addEventListener('error', function(e) {
    console.error('Произошла ошибка:', e.error);
});

// ===== ЭКСПОРТ ДЛЯ ТЕСТИРОВАНИЯ =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initPortfolioFilters,
        initForms,
        initSmoothScroll,
        validateForm
    };
}