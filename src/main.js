document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. Скрипт для мобильного меню (Header)
  // ==========================================================================
  const menuToggle = document.getElementById('menuToggle');
  const headerNav = document.querySelector('.header__nav');
  const navLinks = document.querySelectorAll('.nav__link');

  const toggleMenu = () => {
      headerNav.classList.toggle('is-open');
      // Обновление иконки
      const iconElement = menuToggle.querySelector('svg');
      if (headerNav.classList.contains('is-open')) {
          iconElement.setAttribute('data-lucide', 'x');
      } else {
          iconElement.setAttribute('data-lucide', 'menu');
      }
      // Переинициализация иконок после смены data-lucide
      lucide.createIcons();
  };

  menuToggle.addEventListener('click', toggleMenu);

  // Закрытие меню при клике на ссылку (только для мобильной версии)
  navLinks.forEach(link => {
      link.addEventListener('click', () => {
          if (window.innerWidth < 768) {
              // Добавляем небольшую задержку для плавности скролла
              setTimeout(() => {
                  if (headerNav.classList.contains('is-open')) {
                      toggleMenu();
                  }
              }, 200);
          }
      });
  });


  // ==========================================================================
  // 2. Скрипт для Cookie Pop-up (Этап 5)
  // ==========================================================================
  const cookiePopup = document.getElementById('cookiePopup');
  const acceptCookiesButton = document.getElementById('acceptCookies');
  const cookieAccepted = localStorage.getItem('ionix_cookies_accepted');

  // Функция показа/скрытия
  const showCookiePopup = () => {
      if (!cookieAccepted) {
          cookiePopup.classList.remove('is-hidden');
      }
  }

  const hideCookiePopup = () => {
      cookiePopup.classList.add('is-hidden');
      localStorage.setItem('ionix_cookies_accepted', 'true');
  }

  // Показываем, если не было принято
  showCookiePopup();

  // Обработчик кнопки "Принять"
  acceptCookiesButton.addEventListener('click', hideCookiePopup);
});

const canvas = document.getElementById('brainCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;

        // Определяем размеры
        const setCanvasSize = () => {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        };

        // Точка (Нейрон)
        class Neuron {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.radius = Math.random() * 2 + 1; // 1 до 3
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
            }

            // Рисование точки
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(30, 110, 234, 0.8)'; // Синий
                ctx.fill();
            }

            // Обновление позиции
            update() {
                // Движение
                this.x += this.speedX;
                this.y += this.speedY;

                // Отскок от края
                if (this.x < 0 || this.x > width) this.speedX = -this.speedX;
                if (this.y < 0 || this.y > height) this.speedY = -this.speedY;

                // Эффект гравитации к центру
                const centerX = width / 2;
                const centerY = height / 2;
                const dx = centerX - this.x;
                const dy = centerY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist > width/3) { // Точки притягиваются к центру, если они далеко
                    this.speedX += dx * 0.0001;
                    this.speedY += dy * 0.0001;
                }

                this.draw();
            }
        }

        let neurons = [];
        const numNeurons = 50;

        // Создание нейронов
        const init = () => {
            setCanvasSize();
            neurons = [];
            for (let i = 0; i < numNeurons; i++) {
                // Создаем точки в центре
                const x = width / 2 + (Math.random() - 0.5) * width/3;
                const y = height / 2 + (Math.random() - 0.5) * height/3;
                neurons.push(new Neuron(x, y));
            }
        };

        // Соединение нейронов линиями
        const connect = () => {
            const maxDistance = 90; // Максимальная дистанция для соединения
            for (let i = 0; i < neurons.length; i++) {
                for (let j = i; j < neurons.length; j++) {
                    const dx = neurons[i].x - neurons[j].x;
                    const dy = neurons[i].y - neurons[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(30, 110, 234, ${1 - distance / maxDistance})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(neurons[i].x, neurons[i].y);
                        ctx.lineTo(neurons[j].x, neurons[j].y);
                        ctx.stroke();
                    }
                }
            }
        };

        // Главный цикл анимации
        const animate = () => {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, width, height);

            connect(); // Рисуем линии перед точками

            neurons.forEach(neuron => {
                neuron.update();
            });
        };

        // Переинициализация при изменении размера
        window.addEventListener('resize', init);

        init();
        animate();
    }
    const accordionHeaders = document.querySelectorAll('.accordion__header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isExpanded = header.getAttribute('aria-expanded') === 'true';

            // Закрыть все, кроме текущего
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header) {
                    otherHeader.setAttribute('aria-expanded', 'false');
                    const otherContent = otherHeader.nextElementSibling;
                    otherContent.style.maxHeight = null;
                }
            });

            // Открыть или закрыть текущий элемент
            if (!isExpanded) {
                header.setAttribute('aria-expanded', 'true');
                // Устанавливаем max-height на scrollHeight для плавного открытия
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                header.setAttribute('aria-expanded', 'false');
                content.style.maxHeight = null;
            }
        });
    });


    const contactForm = document.getElementById('contactForm');
    const captchaDisplay = document.getElementById('captchaDisplay');
    const captchaInput = document.getElementById('captchaInput');
    const captchaMessage = document.getElementById('captchaMessage');
    const submissionMessage = document.getElementById('submissionMessage');
    const policyAccept = document.getElementById('policyAccept'); // НОВЫЙ ЭЛЕМЕНТ

    let correctAnswer = 0;

    /**
     * Генерирует простой математический пример (CAPTCHA).
     */
    function generateCaptcha() {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        correctAnswer = num1 + num2;
        captchaDisplay.textContent = `${num1} + ${num2} = ?`;
        captchaMessage.textContent = '';
        captchaInput.value = '';
    }

    /**
     * Валидирует ответ CAPTCHA.
     * @returns {boolean} True, если ответ верный.
     */
    function validateCaptcha() {
        if (!captchaInput.value.trim()) {
            captchaMessage.textContent = 'Пожалуйста, решите пример.';
            captchaMessage.style.color = '#721c24';
            return false;
        }

        const userAnswer = parseInt(captchaInput.value.trim());
        if (userAnswer === correctAnswer) {
            captchaMessage.textContent = 'Капча успешно пройдена!';
            captchaMessage.style.color = '#155724';
            return true;
        } else {
            captchaMessage.textContent = 'Неверный ответ. Попробуйте еще раз.';
            captchaMessage.style.color = '#721c24';
            generateCaptcha();
            return false;
        }
    }

    // Инициализация CAPTCHA при загрузке страницы
    generateCaptcha();

    // Обработчик отправки формы
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        submissionMessage.style.display = 'none';

        // 1. Проверка CAPTCHA
        const isCaptchaValid = validateCaptcha();

        // 2. Проверка Чекбокса (браузерная проверка required уже сработает, но делаем для надежности)
        const isPolicyAccepted = policyAccept.checked;

        if (isCaptchaValid && isPolicyAccepted) {

            // Имитация успешной отправки данных
            console.log('Form Submitted and Validated:', {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value,
                policy: isPolicyAccepted
            });

            // Показываем сообщение об успехе ТОЛЬКО после успешной валидации
            submissionMessage.style.display = 'block';

            // Сброс формы и генерация новой капчи
            contactForm.reset();
            generateCaptcha();

            // Автоматически скрываем сообщение через 5 секунд
            setTimeout(() => {
                submissionMessage.style.display = 'none';
            }, 5000);

        } else if (!isPolicyAccepted) {
            alert('Пожалуйста, примите условия использования и политику конфиденциальности.');
            policyAccept.focus();
        }
      });
