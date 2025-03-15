document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const userInput = document.getElementById('userInput');
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const imagePreviewContainer = document.querySelector('.image-preview-container');
    const generateTextPromptBtn = document.getElementById('generateTextPrompt');
    const generateImagePromptBtn = document.getElementById('generateImagePrompt');
    const resultCard = document.querySelector('.result-card');
    const generatedPrompt = document.getElementById('generatedPrompt');
    const copyPromptBtn = document.getElementById('copyPrompt');
    const editPromptBtn = document.getElementById('editPrompt');
    const savePromptBtn = document.getElementById('savePrompt');
    const historyList = document.getElementById('history-list');
    const templateButtons = document.querySelectorAll('[data-template]');
    const imageContext = document.getElementById('imageContext');
    
    // Prompt Limit Elements
    const promptCounter = document.getElementById('prompt-counter');
    const promptLimitModal = new bootstrap.Modal(document.getElementById('promptLimitModal'));
    const premiumStatusModal = new bootstrap.Modal(document.getElementById('premiumStatusModal'));
    const premiumBadge = document.getElementById('premium-badge');
    const premiumStatusText = document.getElementById('premium-status-text');
    const showPremiumStatus = document.getElementById('show-premium-status');
    const premiumActive = document.getElementById('premium-active');
    const premiumInactive = document.getElementById('premium-inactive');
    const premiumExpiryDate = document.getElementById('premium-expiry-date');
    const limitResetTime = document.getElementById('limit-reset-time');
    
    // Navigation Elements
    const navHome = document.getElementById('nav-home');
    const navTemplates = document.getElementById('nav-templates');
    const navHistory = document.getElementById('nav-history');
    const navSettings = document.getElementById('nav-settings');
    const navAbout = document.getElementById('nav-about');
    
    // Content Sections
    const homeSection = document.getElementById('home-section');
    const templatesSection = document.getElementById('templates-section');
    const historySection = document.getElementById('history-section');
    const settingsSection = document.getElementById('settings-section');
    const aboutSection = document.getElementById('about-section');
    const historyContainer = document.getElementById('history-container');
    
    // History Management
    const clearHistoryBtn = document.getElementById('clearHistory');
    const clearHistoryBtnLarge = document.getElementById('clearHistoryBtn');
    
    // Settings Elements
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    const saveHistorySwitch = document.getElementById('saveHistorySwitch');
    const historyLimitSelect = document.getElementById('historyLimitSelect');
    const defaultFormalitySwitch = document.getElementById('defaultFormalitySwitch');
    const defaultDetailSwitch = document.getElementById('defaultDetailSwitch');
    const defaultCreativeSwitch = document.getElementById('defaultCreativeSwitch');
    const defaultInstructionSwitch = document.getElementById('defaultInstructionSwitch');
    const grammarCorrectionSwitch = document.getElementById('grammarCorrectionSwitch');
    const saveSettingsBtn = document.getElementById('saveSettings');
    
    // Modal Elements
    const editHistoryModal = new bootstrap.Modal(document.getElementById('editHistoryModal'), {
        keyboard: false
    });
    const editHistoryTitle = document.getElementById('editHistoryTitle');
    const editHistoryPrompt = document.getElementById('editHistoryPrompt');
    const editHistoryId = document.getElementById('editHistoryId');
    const saveHistoryEdit = document.getElementById('saveHistoryEdit');
    
    // Options
    const formalitySwitch = document.getElementById('formalitySwitch');
    const detailSwitch = document.getElementById('detailSwitch');
    const creativeSwitch = document.getElementById('creativeSwitch');
    const instructionSwitch = document.getElementById('instructionSwitch');
    
    // Prompt Limit Constants
    const DAILY_PROMPT_LIMIT = 20;
    const PREMIUM_DURATION_DAYS = 30;
    
    // Prompt Usage Tracking
    let promptUsage = {
        count: 0,
        date: new Date().toDateString(),
        premium: false,
        premiumExpiry: null,
        deviceId: null,
        lastIpAddress: null
    };
    
    // Templates
    const promptTemplates = {
        creative: {
            prefix: "Create a creative and engaging response that ",
            suffix: " Use vivid language and imaginative concepts."
        },
        academic: {
            prefix: "Provide a well-researched, academic analysis of ",
            suffix: " Include relevant theories and cite potential sources."
        },
        business: {
            prefix: "Develop a professional business response regarding ",
            suffix: " Focus on actionable insights and strategic considerations."
        },
        technical: {
            prefix: "Explain in technical detail ",
            suffix: " Include specific implementation details and best practices."
        },
        image: {
            prefix: "Describe this image in detail: ",
            suffix: " Include visual elements, composition, colors, subjects, and overall mood."
        }
    };
    
    // Settings
    let settings = {
        darkMode: false,
        saveHistory: true,
        historyLimit: 10,
        defaultOptions: {
            formality: false,
            detail: false,
            creative: false,
            instruction: false
        }
    };
    
    // Local Storage for History and Settings
    let promptHistory = JSON.parse(localStorage.getItem('promptHistory')) || [];
    
    // Initialize
    init();
    
    function init() {
        // Load settings
        loadSettings();
        
        // Apply settings
        applySettings();
        
        // Load prompt usage data
        loadPromptUsage();
        
        // Initialize device ID if not already set
        initializeDeviceId();
        
        // Update prompt counter display
        updatePromptCounter();
        
        // Check premium status
        checkPremiumStatus();
        
        // Disable image prompt button until image is uploaded
        generateImagePromptBtn.disabled = true;
        
        // Load history
        renderHistory();
        renderHistoryPage();
        
        // Select first template by default
        const firstTemplate = document.querySelector('.list-group-item');
        if (firstTemplate) {
            firstTemplate.classList.add('active');
        }
        
        // Event Listeners
        // Navigation
        navHome.addEventListener('click', () => navigateTo('home'));
        navTemplates.addEventListener('click', () => navigateTo('templates'));
        navHistory.addEventListener('click', () => navigateTo('history'));
        navSettings.addEventListener('click', () => navigateTo('settings'));
        navAbout.addEventListener('click', () => navigateTo('about'));
        
        // Image Upload
        imageUpload.addEventListener('change', handleImageUpload);
        
        // Generate Prompts
        generateTextPromptBtn.addEventListener('click', generateTextPrompt);
        generateImagePromptBtn.addEventListener('click', generateImagePrompt);
        
        // Prompt Actions
        copyPromptBtn.addEventListener('click', copyPrompt);
        editPromptBtn.addEventListener('click', editPrompt);
        savePromptBtn.addEventListener('click', savePrompt);
        
        // History Management
        clearHistoryBtn.addEventListener('click', confirmClearHistory);
        clearHistoryBtnLarge.addEventListener('click', confirmClearHistory);
        
        // Settings
        saveSettingsBtn.addEventListener('click', saveSettings);
        darkModeSwitch.addEventListener('change', toggleDarkMode);
        
        // Template buttons
        templateButtons.forEach(button => {
            button.addEventListener('click', () => applyTemplate(button.dataset.template));
        });
        
        // History Edit
        saveHistoryEdit.addEventListener('click', updateHistoryItem);
        
        // Premium Status
        showPremiumStatus.addEventListener('click', (e) => {
            e.preventDefault();
            showPremiumStatusModal();
        });
        
        console.log("AI Prompt Generator initialized");
    }
    
    // Navigation
    function navigateTo(section) {
        // Hide all sections
        homeSection.classList.add('d-none');
        templatesSection.classList.add('d-none');
        historySection.classList.add('d-none');
        settingsSection.classList.add('d-none');
        aboutSection.classList.add('d-none');
        
        // Remove active class from all nav links
        navHome.classList.remove('active');
        navTemplates.classList.remove('active');
        navHistory.classList.remove('active');
        navSettings.classList.remove('active');
        navAbout.classList.remove('active');
        
        // Show selected section and set active nav link
        switch(section) {
            case 'templates':
                templatesSection.classList.remove('d-none');
                navTemplates.classList.add('active');
                break;
            case 'history':
                historySection.classList.remove('d-none');
                navHistory.classList.add('active');
                renderHistoryPage(); // Refresh history page
                break;
            case 'settings':
                settingsSection.classList.remove('d-none');
                navSettings.classList.add('active');
                break;
            case 'about':
                aboutSection.classList.remove('d-none');
                navAbout.classList.add('active');
                break;
            default: // Home
                homeSection.classList.remove('d-none');
                navHome.classList.add('active');
        }
    }
    
    // Handle image upload
    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                imagePreview.src = event.target.result;
                imagePreviewContainer.classList.remove('d-none');
                generateImagePromptBtn.disabled = false;
            };
            
            reader.readAsDataURL(file);
        } else {
            imagePreviewContainer.classList.add('d-none');
            generateImagePromptBtn.disabled = true;
        }
    }
    
    // Apply template
    function applyTemplate(templateName) {
        if (templateName === 'image') {
            // Switch to image tab
            const imageTab = document.getElementById('image-tab');
            bootstrap.Tab.getOrCreateInstance(imageTab).show();
            
            // Navigate to home if not already there
            navigateTo('home');
        } else {
            // Switch to text tab
            const textTab = document.getElementById('text-tab');
            bootstrap.Tab.getOrCreateInstance(textTab).show();
            
            // Navigate to home if not already there
            navigateTo('home');
            
            // Apply template placeholder
            userInput.placeholder = `Enter your ${templateName} content here...`;
            userInput.focus();
            
            // Set this template as active
            document.querySelectorAll('.list-group-item').forEach(item => {
                if (item.dataset.template === templateName) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
    }
    
    // Generate text prompt
    function generateTextPrompt() {
        if (!userInput.value.trim()) {
            showToast('Please enter some text first', 'warning');
            return;
        }
        
        // Check if user can generate a prompt
        if (!canGeneratePrompt()) {
            return;
        }
        
        try {
            // Get user input
            let prompt = userInput.value.trim();
            
            const selectedTemplate = getSelectedTemplate();
            console.log("Selected template for text prompt:", selectedTemplate);
            
            // Apply template
            if (selectedTemplate && promptTemplates[selectedTemplate] && selectedTemplate !== 'image') {
                prompt = promptTemplates[selectedTemplate].prefix + prompt + promptTemplates[selectedTemplate].suffix;
            } else if (selectedTemplate === 'image') {
                // If image template is selected in text tab, use creative template instead
                prompt = promptTemplates.creative.prefix + prompt + promptTemplates.creative.suffix;
            } else {
                // Default to creative if no template is selected
                prompt = promptTemplates.creative.prefix + prompt + promptTemplates.creative.suffix;
            }
            
            // Apply options
            prompt = applyOptions(prompt);
            
            // Increment prompt usage
            incrementPromptUsage();
            
            // Display result
            showResult(prompt);
        } catch (error) {
            console.error("Error generating text prompt:", error);
            showToast("An error occurred while generating the prompt. Please try again.", "error");
        }
    }
    
    // Generate image prompt
    function generateImagePrompt() {
        if (!imageUpload.files[0]) {
            showToast('Please upload an image first', 'warning');
            return;
        }
        
        // Check if user can generate a prompt
        if (!canGeneratePrompt()) {
            return;
        }
        
        try {
            // Get image details
            const file = imageUpload.files[0];
            
            // Generate a simulated image description based on file properties and context
            let imageDescription = "";
            
            // Add context if provided, otherwise use file information
            if (imageContext.value.trim()) {
                // Get context
                imageDescription = imageContext.value.trim();
            } else {
                // Generate a more detailed description based on file name and type
                imageDescription = simulateImageDescription(file);
            }
            
            // Create prompt with image template
            let prompt = promptTemplates.image.prefix + imageDescription + promptTemplates.image.suffix;
            
            // Apply options
            prompt = applyOptions(prompt);
            
            // Increment prompt usage
            incrementPromptUsage();
            
            // Display result
            showResult(prompt);
        } catch (error) {
            console.error("Error generating image prompt:", error);
            showToast("An error occurred while generating the image prompt. Please try again.", "error");
        }
    }
    
    // Simulate image description based on file properties
    function simulateImageDescription(file) {
        const fileName = file.name.toLowerCase();
        const fileExt = fileName.split('.').pop();
        
        // Base description
        let description = "An image";
        
        // Try to extract meaningful information from filename
        if (fileName.includes('person') || fileName.includes('people') || fileName.includes('portrait')) {
            description = "A photograph showing one or more people, possibly a portrait or group shot";
        } else if (fileName.includes('landscape') || fileName.includes('nature') || fileName.includes('outdoor')) {
            description = "A landscape photograph showing natural scenery, possibly with mountains, trees, or water features";
        } else if (fileName.includes('city') || fileName.includes('urban') || fileName.includes('building')) {
            description = "An urban scene showing buildings, city streets, or architectural elements";
        } else if (fileName.includes('food') || fileName.includes('meal') || fileName.includes('dish')) {
            description = "A food photograph showing prepared dishes, ingredients, or culinary presentation";
        } else if (fileName.includes('art') || fileName.includes('painting') || fileName.includes('drawing')) {
            description = "An artwork, possibly a painting, drawing, or digital art piece";
        } else if (fileName.includes('product') || fileName.includes('item')) {
            description = "A product photograph showing an item against a clean background";
        } else {
            // Generic description with file details
            description = `An image file named "${fileName}" (${file.type}, ${Math.round(file.size / 1024)}KB)`;
        }
        
        return description + ". Please provide a detailed description of this image including visual elements, composition, colors, subjects, and overall mood.";
    }
    
    // Get selected template based on active tab
    function getSelectedTemplate() {
        const activeTab = document.querySelector('.nav-link.active');
        if (activeTab.id === 'text-tab') {
            // Find which template button has the active class
            const activeTemplate = document.querySelector('.list-group-item.active');
            if (activeTemplate) {
                console.log("Active template:", activeTemplate.dataset.template);
                return activeTemplate.dataset.template;
            } else {
                // Default to creative if no template is selected
                console.log("No active template found, defaulting to creative");
                return "creative";
            }
        } else {
            return 'image';
        }
    }
    
    // Apply options to prompt
    function applyOptions(prompt) {
        if (formalitySwitch.checked) {
            prompt = `Please provide a formal and professional response to the following: ${prompt}`;
        }
        
        if (detailSwitch.checked) {
            prompt += " Please be detailed and comprehensive in your response.";
        }
        
        if (creativeSwitch.checked) {
            prompt += " Feel free to be creative and think outside the box.";
        }
        
        if (instructionSwitch.checked) {
            prompt += " Please follow these instructions carefully and provide a step-by-step response.";
        }
        
        return prompt;
    }
    
    // Show result
    function showResult(prompt) {
        generatedPrompt.value = prompt;
        resultCard.classList.remove('d-none');
        resultCard.scrollIntoView({ behavior: 'smooth' });
        resultCard.classList.add('fade-in');
    }
    
    // Copy prompt to clipboard
    function copyPrompt() {
        generatedPrompt.select();
        document.execCommand('copy');
        showToast('Prompt copied to clipboard!', 'success');
    }
    
    // Edit prompt
    function editPrompt() {
        generatedPrompt.readOnly = false;
        generatedPrompt.focus();
        editPromptBtn.textContent = 'Done Editing';
        editPromptBtn.onclick = finishEditing;
    }
    
    // Finish editing
    function finishEditing() {
        generatedPrompt.readOnly = true;
        editPromptBtn.innerHTML = '<i class="fas fa-edit"></i> Edit';
        editPromptBtn.onclick = editPrompt;
        showToast('Prompt updated!', 'success');
    }
    
    // Save prompt to history
    function savePrompt() {
        const prompt = generatedPrompt.value;
        if (!prompt) return;
        
        // Check if history saving is enabled
        if (!settings.saveHistory) {
            showToast('History saving is disabled in settings', 'info');
            return;
        }
        
        const timestamp = new Date().toISOString();
        const title = prompt.substring(0, 30) + (prompt.length > 30 ? '...' : '');
        
        const historyItem = {
            id: Date.now(),
            title,
            prompt,
            timestamp
        };
        
        promptHistory.unshift(historyItem);
        
        // Limit history based on settings
        if (promptHistory.length > settings.historyLimit) {
            promptHistory = promptHistory.slice(0, settings.historyLimit);
        }
        
        // Save to local storage
        localStorage.setItem('promptHistory', JSON.stringify(promptHistory));
        
        // Update UI
        renderHistory();
        renderHistoryPage();
        showToast('Prompt saved to history!', 'success');
    }
    
    // Render history in sidebar
    function renderHistory() {
        historyList.innerHTML = '';
        
        if (promptHistory.length === 0) {
            historyList.innerHTML = '<p class="text-muted">No history yet</p>';
            return;
        }
        
        // Show only the most recent 5 items in the sidebar
        const recentHistory = promptHistory.slice(0, 5);
        
        recentHistory.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="d-flex justify-content-between">
                    <div class="history-item-title">${item.title}</div>
                    <div>
                        <small class="text-muted me-2">${formatDate(item.timestamp)}</small>
                        <button class="btn btn-sm btn-link text-danger p-0 delete-history-btn" data-id="${item.id}" title="Delete">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="history-item-preview">${item.prompt}</div>
            `;
            
            // Add click event to load the prompt
            historyItem.addEventListener('click', (e) => {
                // Don't trigger if clicking the delete button
                if (!e.target.closest('.delete-history-btn')) {
                    generatedPrompt.value = item.prompt;
                    resultCard.classList.remove('d-none');
                    navigateTo('home');
                    showToast('Prompt loaded from history', 'info');
                }
            });
            
            // Add delete button event
            const deleteBtn = historyItem.querySelector('.delete-history-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent the parent click event
                    deleteHistoryItem(item.id);
                });
            }
            
            historyList.appendChild(historyItem);
        });
    }
    
    // Render history page
    function renderHistoryPage() {
        historyContainer.innerHTML = '';
        
        if (promptHistory.length === 0) {
            historyContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-history"></i>
                    <h5>No History Yet</h5>
                    <p>Generate and save prompts to see them here.</p>
                </div>
            `;
            return;
        }
        
        // Create a row for the history cards
        const row = document.createElement('div');
        row.className = 'row';
        
        promptHistory.forEach(item => {
            const col = document.createElement('div');
            col.className = 'col-md-6 mb-3';
            
            const card = document.createElement('div');
            card.className = 'card history-card';
            card.innerHTML = `
                <div class="card-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="card-title">${item.title}</h5>
                        <small class="text-muted">${formatDate(item.timestamp)}</small>
                    </div>
                </div>
                <div class="card-body">
                    <p class="card-text">${item.prompt}</p>
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-sm btn-outline-primary load-btn" data-id="${item.id}">
                            <i class="fas fa-arrow-right"></i> Load
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-secondary edit-btn" data-id="${item.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-danger delete-btn" data-id="${item.id}">
                            <i class="fas fa-trash-alt"></i> Delete
                        </button>
                    </div>
                </div>
            `;
            
            // Add event listeners
            const loadBtn = card.querySelector('.load-btn');
            const editBtn = card.querySelector('.edit-btn');
            const deleteBtn = card.querySelector('.delete-btn');
            
            loadBtn.addEventListener('click', () => loadHistoryItem(item.id));
            editBtn.addEventListener('click', () => openEditModal(item.id));
            deleteBtn.addEventListener('click', () => deleteHistoryItem(item.id));
            
            col.appendChild(card);
            row.appendChild(col);
        });
        
        historyContainer.appendChild(row);
    }
    
    // Load history item
    function loadHistoryItem(id) {
        const item = promptHistory.find(item => item.id === id);
        if (item) {
            generatedPrompt.value = item.prompt;
            resultCard.classList.remove('d-none');
            navigateTo('home');
            showToast('Prompt loaded from history', 'info');
        }
    }
    
    // Open edit modal
    function openEditModal(id) {
        const item = promptHistory.find(item => item.id === id);
        if (item) {
            editHistoryTitle.value = item.title;
            editHistoryPrompt.value = item.prompt;
            editHistoryId.value = item.id;
            
            // Show the modal using Bootstrap's modal API
            const editModal = new bootstrap.Modal(document.getElementById('editHistoryModal'));
            editModal.show();
        }
    }
    
    // Update history item
    function updateHistoryItem() {
        const id = parseInt(editHistoryId.value);
        const title = editHistoryTitle.value;
        const prompt = editHistoryPrompt.value;
        
        if (!title || !prompt) {
            showToast('Title and prompt cannot be empty', 'warning');
            return;
        }
        
        // Find and update the item
        const index = promptHistory.findIndex(item => item.id === id);
        if (index !== -1) {
            promptHistory[index].title = title;
            promptHistory[index].prompt = prompt;
            
            // Save to local storage
            localStorage.setItem('promptHistory', JSON.stringify(promptHistory));
            
            // Update UI
            renderHistory();
            renderHistoryPage();
            
            // Close modal
            bootstrap.Modal.getInstance(document.getElementById('editHistoryModal')).hide();
            
            showToast('History item updated!', 'success');
        }
    }
    
    // Delete history item
    function deleteHistoryItem(id) {
        if (confirm('Are you sure you want to delete this item?')) {
            // Filter out the item
            promptHistory = promptHistory.filter(item => item.id !== id);
            
            // Save to local storage
            localStorage.setItem('promptHistory', JSON.stringify(promptHistory));
            
            // Update UI
            renderHistory();
            renderHistoryPage();
            
            showToast('History item deleted!', 'success');
        }
    }
    
    // Confirm clear history
    function confirmClearHistory() {
        if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
            clearHistory();
        }
    }
    
    // Clear history
    function clearHistory() {
        promptHistory = [];
        localStorage.setItem('promptHistory', JSON.stringify(promptHistory));
        renderHistory();
        renderHistoryPage();
        showToast('History cleared!', 'success');
    }
    
    // Format date
    function formatDate(isoString) {
        const date = new Date(isoString);
        return date.toLocaleDateString();
    }
    
    // Load settings
    function loadSettings() {
        try {
            const savedSettings = JSON.parse(localStorage.getItem('settings'));
            if (savedSettings) {
                settings = { ...settings, ...savedSettings };
            }
            
            console.log("Settings loaded:", settings);
        } catch (error) {
            console.error("Error loading settings:", error);
            // Reset to defaults if there's an error
            settings = {
                darkMode: false,
                saveHistory: true,
                historyLimit: 10,
                defaultOptions: {
                    formality: false,
                    detail: false,
                    creative: false,
                    instruction: false
                }
            };
        }
    }
    
    // Save settings
    function saveSettings() {
        // Update settings object
        settings.darkMode = darkModeSwitch.checked;
        settings.saveHistory = saveHistorySwitch.checked;
        settings.historyLimit = parseInt(historyLimitSelect.value);
        
        settings.defaultOptions = {
            formality: defaultFormalitySwitch.checked,
            detail: defaultDetailSwitch.checked,
            creative: defaultCreativeSwitch.checked,
            instruction: defaultInstructionSwitch.checked
        };
        
        // Save to local storage
        localStorage.setItem('settings', JSON.stringify(settings));
        
        // Apply settings
        applySettings();
        
        showToast('Settings saved!', 'success');
    }
    
    // Apply settings
    function applySettings() {
        // Apply dark mode
        if (settings.darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        // Set form values
        darkModeSwitch.checked = settings.darkMode;
        saveHistorySwitch.checked = settings.saveHistory;
        historyLimitSelect.value = settings.historyLimit;
        defaultFormalitySwitch.checked = settings.defaultOptions.formality;
        defaultDetailSwitch.checked = settings.defaultOptions.detail;
        defaultCreativeSwitch.checked = settings.defaultOptions.creative;
        defaultInstructionSwitch.checked = settings.defaultOptions.instruction;
        
        // Apply default options
        formalitySwitch.checked = settings.defaultOptions.formality;
        detailSwitch.checked = settings.defaultOptions.detail;
        creativeSwitch.checked = settings.defaultOptions.creative;
        instructionSwitch.checked = settings.defaultOptions.instruction;
    }
    
    // Toggle dark mode
    function toggleDarkMode() {
        if (darkModeSwitch.checked) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }
    
    // Show toast notification
    function showToast(message, type = 'info') {
        try {
            // Check if toast container exists, if not create it
            let toastContainer = document.querySelector('.toast-container');
            if (!toastContainer) {
                toastContainer = document.createElement('div');
                toastContainer.className = 'toast-container';
                document.body.appendChild(toastContainer);
            }
            
            // Create toast
            const toast = document.createElement('div');
            toast.className = 'toast show';
            toast.setAttribute('role', 'alert');
            toast.setAttribute('aria-live', 'assertive');
            toast.setAttribute('aria-atomic', 'true');
            
            // Set icon based on type
            let icon;
            switch (type) {
                case 'success':
                    icon = 'fa-check-circle text-success';
                    break;
                case 'warning':
                    icon = 'fa-exclamation-triangle text-warning';
                    break;
                case 'error':
                    icon = 'fa-times-circle text-danger';
                    break;
                default:
                    icon = 'fa-info-circle text-info';
            }
            
            toast.innerHTML = `
                <div class="toast-header">
                    <i class="fas ${icon} me-2"></i>
                    <strong class="me-auto">AI Prompt Generator</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            `;
            
            // Add to container
            toastContainer.appendChild(toast);
            
            // Add close button functionality
            const closeBtn = toast.querySelector('.btn-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    toast.remove();
                });
            }
            
            // Auto remove after 5 seconds for grammar corrections (they might need more time to read)
            // or 3 seconds for other notifications
            const timeout = message.includes('Grammar and spelling corrected') ? 5000 : 3000;
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, timeout);
        } catch (error) {
            console.error("Error showing toast:", error);
            // Fallback to alert for critical messages
            if (type === 'error') {
                alert(message);
            }
        }
    }
    
    // Add active class to template buttons
    document.querySelectorAll('.list-group-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.list-group-item').forEach(el => {
                el.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // Load prompt usage data from local storage
    function loadPromptUsage() {
        try {
            const savedUsage = JSON.parse(localStorage.getItem('promptUsage'));
            if (savedUsage) {
                // Check if it's a new day
                if (savedUsage.date !== new Date().toDateString() && !savedUsage.premium) {
                    // Reset count for a new day if not premium
                    promptUsage = {
                        ...savedUsage,
                        count: 0,
                        date: new Date().toDateString()
                    };
                    savePromptUsage();
                } else {
                    promptUsage = savedUsage;
                }
            }
            console.log("Prompt usage loaded:", promptUsage);
        } catch (error) {
            console.error("Error loading prompt usage:", error);
            resetPromptUsage();
        }
    }

    // Save prompt usage data to local storage
    function savePromptUsage() {
        localStorage.setItem('promptUsage', JSON.stringify(promptUsage));
    }

    // Reset prompt usage to defaults
    function resetPromptUsage() {
        promptUsage = {
            count: 0,
            date: new Date().toDateString(),
            premium: false,
            premiumExpiry: null,
            deviceId: generateDeviceId(),
            lastIpAddress: null
        };
        savePromptUsage();
    }

    // Generate a unique device ID
    function generateDeviceId() {
        const nav = window.navigator;
        const screen = window.screen;
        let deviceId = '';
        
        // Use available browser information to create a pseudo-unique ID
        deviceId += nav.userAgent.replace(/\D+/g, '');
        deviceId += screen.height || '';
        deviceId += screen.width || '';
        deviceId += screen.pixelDepth || '';
        deviceId += nav.language || '';
        
        // Add a timestamp for additional uniqueness
        deviceId += Date.now();
        
        // Hash the string to get a more uniform ID
        return hashString(deviceId);
    }

    // Simple string hashing function
    function hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString(16); // Convert to hex string
    }

    // Initialize device ID if not already set
    function initializeDeviceId() {
        if (!promptUsage.deviceId) {
            promptUsage.deviceId = generateDeviceId();
            savePromptUsage();
        }
        
        // Attempt to get IP address (this is a mock implementation)
        // In a real implementation, you would use a server-side API
        fetchIpAddress();
    }

    // Mock function to fetch IP address
    // In a real implementation, this would call a server API
    function fetchIpAddress() {
        // Simulate an API call with a timeout
        setTimeout(() => {
            // This is a mock IP - in a real implementation, you would get this from a server
            const mockIp = '192.168.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255);
            promptUsage.lastIpAddress = mockIp;
            savePromptUsage();
            console.log("IP address updated:", mockIp);
        }, 1000);
    }

    // Update the prompt counter display
    function updatePromptCounter() {
        if (promptCounter) {
            promptCounter.textContent = `${promptUsage.count}/${DAILY_PROMPT_LIMIT}`;
            
            // Update counter styling based on usage
            promptCounter.classList.remove('warning', 'danger');
            if (promptUsage.premium) {
                promptCounter.textContent = `${promptUsage.count}/∞`;
                premiumStatusText.textContent = 'Premium';
                premiumBadge.classList.add('active');
            } else {
                if (promptUsage.count >= DAILY_PROMPT_LIMIT) {
                    promptCounter.classList.add('danger');
                } else if (promptUsage.count >= DAILY_PROMPT_LIMIT * 0.7) {
                    promptCounter.classList.add('warning');
                }
                premiumStatusText.textContent = 'Free';
                premiumBadge.classList.remove('active');
            }
        }
    }

    // Check if user can generate a prompt
    function canGeneratePrompt() {
        // If premium, always allow
        if (promptUsage.premium) {
            return true;
        }
        
        // Check if daily limit reached
        if (promptUsage.count >= DAILY_PROMPT_LIMIT) {
            promptLimitModal.show();
            updateLimitResetTime();
            return false;
        }
        
        return true;
    }

    // Increment prompt usage count
    function incrementPromptUsage() {
        promptUsage.count++;
        savePromptUsage();
        updatePromptCounter();
    }

    // Update the time display for limit reset
    function updateLimitResetTime() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const timeLeft = tomorrow - now;
        const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        
        limitResetTime.textContent = `${hoursLeft} hours and ${minutesLeft} minutes`;
    }

    // Check premium status and update UI
    function checkPremiumStatus() {
        // Check if premium has expired
        if (promptUsage.premium && promptUsage.premiumExpiry) {
            const now = new Date();
            const expiryDate = new Date(promptUsage.premiumExpiry);
            
            if (now > expiryDate) {
                // Premium has expired
                promptUsage.premium = false;
                promptUsage.premiumExpiry = null;
                savePromptUsage();
            }
        }
        
        updatePromptCounter();
    }

    // Show premium status modal
    function showPremiumStatusModal() {
        if (promptUsage.premium && promptUsage.premiumExpiry) {
            premiumActive.classList.remove('d-none');
            premiumInactive.classList.add('d-none');
            
            // Format and display expiry date
            const expiryDate = new Date(promptUsage.premiumExpiry);
            premiumExpiryDate.textContent = expiryDate.toLocaleDateString();
        } else {
            premiumActive.classList.add('d-none');
            premiumInactive.classList.remove('d-none');
        }
        
        premiumStatusModal.show();
    }

    // Activate premium status
    function activatePremium() {
        // Set premium status
        promptUsage.premium = true;
        
        // Set expiry date (30 days from now)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + PREMIUM_DURATION_DAYS);
        promptUsage.premiumExpiry = expiryDate.toISOString();
        
        // Save changes
        savePromptUsage();
        
        // Update UI
        updatePromptCounter();
        
        // Show confirmation
        showToast('Premium status activated! You now have unlimited prompts.', 'success');
    }

    // Mock implementation for Buy Me a Coffee callback
    // In a real implementation, this would be handled by a server-side callback
    // This is just for demonstration purposes
    window.addEventListener('message', function(event) {
        // Check if the message is from the Buy Me a Coffee widget
        if (event.data && typeof event.data === 'object' && event.data.buymeacoffee) {
            console.log('Buy Me a Coffee event received:', event.data);
            
            // Check if it's a successful payment
            if (event.data.success) {
                // Activate premium status
                activatePremium();
                
                // Show confirmation modal
                setTimeout(() => {
                    showPremiumStatusModal();
                }, 1000);
            }
        }
    });

    // For testing purposes only - remove in production
    // This adds a button to the premium status modal to simulate a payment
    document.addEventListener('DOMContentLoaded', function() {
        const testButton = document.createElement('button');
        testButton.className = 'btn btn-sm btn-outline-secondary mt-2';
        testButton.textContent = 'Simulate Payment (Test Only)';
        testButton.addEventListener('click', function() {
            activatePremium();
            bootstrap.Modal.getInstance(document.getElementById('premiumStatusModal')).hide();
            setTimeout(() => {
                showPremiumStatusModal();
            }, 500);
        });
        
        // Add the test button to the premium inactive section
        const premiumInactive = document.getElementById('premium-inactive');
        if (premiumInactive) {
            premiumInactive.appendChild(testButton);
        }
    });
}); 