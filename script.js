// Função para formatar CPF
function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return cpf;
}

// Função para validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validação dos dígitos verificadores
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;
    
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;
    
    return true;
}

// Função para validar e-mail
function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Manipulação do DOM quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    // Elementos
    const cpfInput = document.getElementById('cpf');
    const cpfError = document.getElementById('cpfError');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const adicionarInfoBtn = document.getElementById('adicionarInfo');
    const nomeInfoForm = document.getElementById('nomeInfoForm');
    const novaInfoInput = document.getElementById('novaInfo');
    const salvarInfoBtn = document.getElementById('salvarInfo');
    const cancelarInfoBtn = document.getElementById('cancelarInfo');
    const ucList = document.getElementById('ucList');
    const adicionarInfoPerfilBtn = document.getElementById('adicionarInfoPerfil');
    const novaInfoPerfilInput = document.getElementById('novaInfoPerfil');
    const perfilDiv = document.getElementById('perfil');


    cpfInput.addEventListener('input', function() {
        this.value = formatarCPF(this.value);
    });

    cpfInput.addEventListener('blur', function() {
        if (!validarCPF(this.value)) {
            cpfError.textContent = 'CPF inválido';
        } else {
            cpfError.textContent = '';
        }
    });

    emailInput.addEventListener('blur', function() {
        if (!validarEmail(this.value)) {
            emailError.textContent = 'E-mail inválido';
        } else {
            emailError.textContent = '';
        }
    });

    adicionarInfoBtn.addEventListener('click', function() {
        nomeInfoForm.style.display = 'block';
        novaInfoInput.focus();
    });

    cancelarInfoBtn.addEventListener('click', function() {
        nomeInfoForm.style.display = 'none';
        novaInfoInput.value = '';
    });

    salvarInfoBtn.addEventListener('click', function() {
        let novaInfo = novaInfoInput.value.trim();
        if (novaInfo) {
            addUCToList(novaInfo);
            nomeInfoForm.style.display = 'none';
            novaInfoInput.value = '';
        }
    });

    function addUCToList(ucName) {
        const ucItem = document.createElement('div');
        ucItem.className = 'uc-item';
        ucItem.draggable = true;
        
        ucItem.innerHTML = `
            <span>${ucName}</span>
            <div class="uc-actions">
                <button class="move-up">↑</button>
                <button class="move-down">↓</button>
                <button class="delete-uc">×</button>
            </div>
        `;
        
        ucList.appendChild(ucItem);
     
        ucItem.querySelector('.move-up').addEventListener('click', function() {
            const prev = ucItem.previousElementSibling;
            if (prev) {
                ucList.insertBefore(ucItem, prev);
            }
        });
        
        ucItem.querySelector('.move-down').addEventListener('click', function() {
            const next = ucItem.nextElementSibling;
            if (next) {
                ucList.insertBefore(next, ucItem);
            }
        });
        
        ucItem.querySelector('.delete-uc').addEventListener('click', function() {
            ucItem.remove();
        });

        ucItem.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', '');
            this.classList.add('dragging');
        });
        
        ucItem.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
    }
    
    ucList.addEventListener('dragover', function(e) {
        e.preventDefault();
        const draggingItem = document.querySelector('.dragging');
        const afterElement = getDragAfterElement(ucList, e.clientY);
        
        if (afterElement == null) {
            ucList.appendChild(draggingItem);
        } else {
            ucList.insertBefore(draggingItem, afterElement);
        }
    });
    
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.uc-item:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    adicionarInfoPerfilBtn.addEventListener('click', function() {
        const novaInfo = novaInfoPerfilInput.value.trim();
        if (novaInfo) {
            const p = document.createElement('p');
            p.textContent = novaInfo;
            perfilDiv.appendChild(p);
            novaInfoPerfilInput.value = '';
        }
    });
});