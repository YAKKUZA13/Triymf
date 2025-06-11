class TemplateManager {
    constructor() {
        this.templates = [
            { id: '1', name: 'template 1' },
            { id: '2', name: 'template 2' },
            { id: '3', name: 'template 3' }
        ];
        this.selectedTemplate = null;
        this.nextId = 4;
        
        this.initializeEventListeners();
        this.render();
    }

    initializeEventListeners() {
        document.getElementById('addTemplate').addEventListener('click', () => {
            this.addTemplate();
        });

        document.getElementById('removeTemplate').addEventListener('click', () => {
            this.removeSelectedTemplate();
        });

        const editInput = document.getElementById('editTemplateInput');
        
        editInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.saveEditedTemplate();
            }
        });

        editInput.addEventListener('blur', () => {
            this.saveEditedTemplate();
        });
    }

    render() {
        const templatesList = document.getElementById('templatesList');
        templatesList.innerHTML = '';

        this.templates.forEach(template => {
            const templateElement = document.createElement('div');
            templateElement.className = 'template-item';
            templateElement.textContent = template.name;
            templateElement.dataset.templateId = template.id;

            if (this.selectedTemplate && this.selectedTemplate.id === template.id) {
                templateElement.classList.add('selected');
                document.getElementById('editTemplateInput').value = template.name;
            }

            templateElement.addEventListener('click', () => {
                this.selectTemplate(template);
            });

            templatesList.appendChild(templateElement);
        });

        this.refreshAllDropdowns();
    }

    selectTemplate(template) {
        this.selectedTemplate = template;
        this.render();
    }

    addTemplate() {
        const newTemplate = {
            id: this.nextId.toString(),
            name: 'template'
        };
        this.templates.push(newTemplate);
        this.nextId++;
        this.selectedTemplate = newTemplate;
        this.render();
        
        setTimeout(() => {
            const editInput = document.getElementById('editTemplateInput');
            editInput.focus();
            editInput.select();
        }, 0);
    }

    removeSelectedTemplate() {
        if (!this.selectedTemplate) {
            return;
        }

        const templateId = this.selectedTemplate.id;
        this.templates = this.templates.filter(template => template.id !== templateId);
        this.selectedTemplate = null;
        
        document.getElementById('editTemplateInput').value = '';
        
        this.render();
        
        document.dispatchEvent(new CustomEvent('template-removed', {
            detail: { templateId }
        }));
    }

    saveEditedTemplate() {
        if (!this.selectedTemplate) {
            return;
        }

        const editInput = document.getElementById('editTemplateInput');
        const newName = editInput.value.trim();
        
        if (newName) {
            this.selectedTemplate.name = newName;
            this.render();
        }
    }

    getTemplates() {
        return [...this.templates];
    }

    getTemplateById(id) {
        return this.templates.find(template => template.id === id);
    }

    refreshAllDropdowns() {
        console.log('Refreshing all dropdowns...');
        
        const dropdowns = document.querySelectorAll('custom-dropdown');
        console.log('Main document dropdowns:', dropdowns.length);
        dropdowns.forEach(dropdown => {
            if (dropdown.refresh) {
                dropdown.refresh();
            }
        });

        if (window.tinymce && window.tinymce.activeEditor) {
            const editor = window.tinymce.activeEditor;
            const iframeDoc = editor.getDoc();
            if (iframeDoc) {
                const iframeDropdowns = iframeDoc.querySelectorAll('custom-dropdown');
                console.log('TinyMCE iframe dropdowns:', iframeDropdowns.length);
                iframeDropdowns.forEach(dropdown => {
                    if (dropdown.refresh) {
                        dropdown.refresh();
                    }
                    if (dropdown.updateDropdown) {
                        dropdown.updateDropdown();
                    }
                });
                
                const nonActiveDropdowns = iframeDoc.querySelectorAll('custom-dropdown:not(:defined)');
                if (nonActiveDropdowns.length > 0) {
                    console.log('Found non-active dropdowns, triggering activation...');
                    if (window.tinyMCEApp && window.tinyMCEApp.activateCustomDropdowns) {
                        window.tinyMCEApp.activateCustomDropdowns();
                    }
                }
            }
        }
    }
}

export default TemplateManager; 