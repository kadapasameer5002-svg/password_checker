document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password-input');
    const toggleVisibilityBtn = document.getElementById('toggle-visibility');
    const iconEye = document.querySelector('.icon-eye');
    const iconEyeOff = document.querySelector('.icon-eye-off');
    const clearBtn = document.getElementById('clear-btn');
    
    const strengthText = document.getElementById('strength-text');
    const progressBar = document.getElementById('progress-bar');
    
    const statEntropy = document.getElementById('stat-entropy');
    const statTime = document.getElementById('stat-time');
    const statCombos = document.getElementById('stat-combos');
    
    const reqLength = document.getElementById('req-length');
    const reqUpper = document.getElementById('req-upper');
    const reqLower = document.getElementById('req-lower');
    const reqNumber = document.getElementById('req-number');
    const reqSpecial = document.getElementById('req-special');

    const commonPasswords = [
        "password", "123456", "12345678", "qwerty",
        "abc123", "111111", "iloveyou", "admin",
        "welcome", "monkey", "dragon"
    ];

    // Toggle password visibility
    toggleVisibilityBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        if (type === 'text') {
            iconEye.classList.add('hidden');
            iconEyeOff.classList.remove('hidden');
        } else {
            iconEye.classList.remove('hidden');
            iconEyeOff.classList.add('hidden');
        }
    });

    // Clear input
    clearBtn.addEventListener('click', () => {
        passwordInput.value = '';
        analyzePassword('');
        passwordInput.focus();
    });

    // Format combinations
    const formatNumber = (num) => {
        if (num === 0) return '0';
        if (num < 1000) return num.toString();
        if (num >= 1e15) return num.toExponential(2);
        
        const suffixes = ["", "K", "M", "B", "T", "Qa"];
        const suffixNum = Math.floor(Math.log10(num) / 3);
        
        let shortValue = (num / Math.pow(1000, suffixNum));
        return shortValue.toFixed(1) + suffixes[suffixNum];
    };

    // Format time
    const formatTime = (seconds) => {
        if (seconds === 0) return 'Instantly';
        if (seconds < 1) return 'Instantly';
        if (seconds < 60) return `${Math.round(seconds)} sec`;
        
        const minutes = seconds / 60;
        if (minutes < 60) return `${Math.round(minutes)} min`;
        
        const hours = minutes / 60;
        if (hours < 24) return `${Math.round(hours)} hrs`;
        
        const days = hours / 24;
        if (days < 365) return `${Math.round(days)} days`;
        
        const years = days / 365;
        if (years > 1000000) return '> 1M years';
        return `${Math.round(years)} years`;
    };

    const isWeakPattern = (password) => {
        if (commonPasswords.includes(password.toLowerCase())) return true;
        
        const digitOnly = /^\d+$/.test(password);
        const lowerOnly = /^[a-z]+$/.test(password);
        
        if (digitOnly || lowerOnly) return true;
        
        return false;
    };

    const log2 = (n) => Math.log(n) / Math.log(2);

    const updateChecklist = (password) => {
        const hasMinLength = password.length >= 8;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[^A-Za-z0-9]/.test(password);

        reqLength.classList.toggle('valid', hasMinLength);
        reqUpper.classList.toggle('valid', hasUpper);
        reqLower.classList.toggle('valid', hasLower);
        reqNumber.classList.toggle('valid', hasNumber);
        reqSpecial.classList.toggle('valid', hasSpecial);

        return { hasUpper, hasLower, hasNumber, hasSpecial };
    };

    const analyzePassword = (password) => {
        if (!password) {
            strengthText.textContent = 'None';
            strengthText.style.color = 'var(--text-secondary)';
            progressBar.style.width = '0%';
            progressBar.style.backgroundColor = 'var(--strength-0)';
            
            statEntropy.textContent = '0 bits';
            statTime.textContent = 'Instantly';
            statCombos.textContent = '0';
            
            updateChecklist('');
            return;
        }

        const checks = updateChecklist(password);
        const length = password.length;
        
        let charset = 0;
        if (checks.hasLower) charset += 26;
        if (checks.hasUpper) charset += 26;
        if (checks.hasNumber) charset += 10;
        if (checks.hasSpecial) charset += 32;

        const entropy = length > 0 && charset > 0 ? length * log2(charset) : 0;
        const combinations = Math.pow(charset, length) || 0;
        
        // 1 Billion attempts/sec as per original C code
        const crackTimeSeconds = combinations / 1000000000; 

        // Update stats
        statEntropy.textContent = `${entropy.toFixed(1)} bits`;
        statCombos.textContent = formatNumber(combinations);
        statTime.textContent = formatTime(crackTimeSeconds);

        // Determine strength
        let strength = 0;
        let strengthLabel = 'None';
        let colorVar = '--strength-0';
        let width = '0%';

        const weakPattern = isWeakPattern(password);

        if (weakPattern) {
            strength = 1;
            strengthLabel = 'Weak';
            colorVar = '--strength-1';
            width = '25%';
        } else {
            if (entropy < 28) {
                strength = 1;
                strengthLabel = 'Weak';
                colorVar = '--strength-1';
                width = '25%';
            } else if (entropy < 36) {
                strength = 2;
                strengthLabel = 'Medium';
                colorVar = '--strength-2';
                width = '50%';
            } else if (entropy < 60) {
                strength = 3;
                strengthLabel = 'Strong';
                colorVar = '--strength-3';
                width = '75%';
            } else {
                strength = 4;
                strengthLabel = 'Very Strong';
                colorVar = '--strength-4';
                width = '100%';
            }
        }

        strengthText.textContent = strengthLabel;
        strengthText.style.color = `var(${colorVar})`;
        progressBar.style.width = width;
        progressBar.style.backgroundColor = `var(${colorVar})`;
    };

    passwordInput.addEventListener('input', (e) => {
        analyzePassword(e.target.value);
    });
});
