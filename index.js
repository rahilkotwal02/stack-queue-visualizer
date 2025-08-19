// Enhanced Stack & Queue Visualizer
class DataStructureVisualizer {
    constructor() {
        this.data = [];
        this.mode = 'stack'; // 'stack' or 'queue'
        this.maxSize = 8;
        this.isAnimating = false;
        
        this.initializeElements();
        this.attachEventListeners();
        this.updateDisplay();
    }
    
    initializeElements() {
        this.elements = {
            pushBtn: document.querySelector('.push'),
            popBtn: document.querySelector('.pop'),
            peekBtn: document.querySelector('.peek'),
            resetBtn: document.querySelector('.reset'),
            input: document.querySelector('.text'),
            bucket: document.getElementById('main-bucket'),
            message: document.getElementById('message'),
            messageBox: document.getElementById('message-box'),
            sizeValue: document.getElementById('size-value'),
            topValue: document.getElementById('top-value'),
            lastAdded: document.getElementById('last-added'),
            lastRemoved: document.getElementById('last-removed'),
            capacityText: document.getElementById('capacity-text'),
            structureTitle: document.getElementById('structure-title'),
            structureDescription: document.getElementById('structure-description'),
            addDesc: document.getElementById('add-desc'),
            removeDesc: document.getElementById('remove-desc'),
            modeButtons: document.querySelectorAll('.mode-btn')
        };
    }
    
    attachEventListeners() {
        this.elements.pushBtn.addEventListener('click', () => this.add());
        this.elements.popBtn.addEventListener('click', () => this.remove());
        this.elements.peekBtn.addEventListener('click', () => this.peek());
        this.elements.resetBtn.addEventListener('click', () => this.reset());
        
        this.elements.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.add();
        });
        
        this.elements.modeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.switchMode(btn.dataset.mode));
        });
    }
    
    switchMode(newMode) {
        if (this.isAnimating || newMode === this.mode) return;
        
        this.mode = newMode;
        this.reset();
        
        // Update UI for mode
        this.elements.modeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === newMode);
        });
        
        this.elements.bucket.classList.toggle('queue-mode', newMode === 'queue');
        
        if (newMode === 'stack') {
            this.elements.structureTitle.textContent = 'Stack';
            this.elements.structureDescription.textContent = 'Last In, First Out (LIFO)';
            this.elements.addDesc.textContent = 'Push to top';
            this.elements.removeDesc.textContent = 'Pop from top';
        } else {
            this.elements.structureTitle.textContent = 'Queue';
            this.elements.structureDescription.textContent = 'First In, First Out (FIFO)';
            this.elements.addDesc.textContent = 'Enqueue to rear';
            this.elements.removeDesc.textContent = 'Dequeue from front';
        }
        
        this.showMessage(`Switched to ${newMode.toUpperCase()} mode`, 'success');
    }
    
    add() {
        if (this.isAnimating) return;
        
        const value = this.elements.input.value.trim();
        
        if (!value) {
            this.showMessage('Please enter a value', 'error');
            return;
        }
        
        if (this.data.length >= this.maxSize) {
            this.showMessage(`${this.mode === 'stack' ? 'Stack' : 'Queue'} is full!`, 'error');
            this.elements.input.value = '';
            return;
        }
        
        this.isAnimating = true;
        this.disableButtons();
        
        // Add to data structure
        this.data.push(value);
        
        // Create visual element
        const element = document.createElement('div');
        element.classList.add('element');
        element.textContent = value;
        
        // Position based on mode
        if (this.mode === 'stack') {
            this.elements.bucket.appendChild(element);
        } else {
            this.elements.bucket.insertBefore(element, this.elements.bucket.firstChild);
        }
        
        // Animation
        element.classList.add('element-add');
        
        setTimeout(() => {
            element.classList.remove('element-add');
            this.elements.lastAdded.textContent = value;
            this.showMessage(`${value} ${this.mode === 'stack' ? 'pushed' : 'enqueued'} successfully`, 'success');
            this.elements.input.value = '';
            this.updateDisplay();
            this.enableButtons();
            this.isAnimating = false;
        }, 600);
    }
    
    remove() {
        if (this.isAnimating) return;
        
        if (this.data.length === 0) {
            this.showMessage(`${this.mode === 'stack' ? 'Stack' : 'Queue'} is empty!`, 'error');
            return;
        }
        
        this.isAnimating = true;
        this.disableButtons();
        
        let removedValue, elementToRemove;
        
        if (this.mode === 'stack') {
            // Stack: remove from top (last element)
            removedValue = this.data.pop();
            elementToRemove = this.elements.bucket.lastElementChild;
        } else {
            // Queue: remove from front (first element)
            removedValue = this.data.shift();
            elementToRemove = this.elements.bucket.lastElementChild; // In queue mode, last child is visually first
        }
        
        elementToRemove.classList.add('element-remove');
        
        setTimeout(() => {
            this.elements.bucket.removeChild(elementToRemove);
            this.elements.lastRemoved.textContent = removedValue;
            this.showMessage(`${removedValue} ${this.mode === 'stack' ? 'popped' : 'dequeued'} successfully`, 'success');
            this.updateDisplay();
            this.enableButtons();
            this.isAnimating = false;
        }, 600);
    }
    
    peek() {
        if (this.isAnimating) return;
        
        if (this.data.length === 0) {
            this.showMessage(`${this.mode === 'stack' ? 'Stack' : 'Queue'} is empty!`, 'error');
            return;
        }
        
        const peekValue = this.mode === 'stack' ? 
            this.data[this.data.length - 1] : this.data[0];
        
        const elementToPeek = this.mode === 'stack' ? 
            this.elements.bucket.lastElementChild : this.elements.bucket.lastElementChild;
        
        elementToPeek.classList.add('element-peek');
        
        setTimeout(() => {
            elementToPeek.classList.remove('element-peek');
        }, 800);
        
        this.showMessage(`Peek: ${peekValue}`, 'warning');
    }
    
    reset() {
        if (this.isAnimating) return;
        
        this.data = [];
        this.elements.bucket.innerHTML = '';
        this.elements.lastAdded.textContent = '-';
        this.elements.lastRemoved.textContent = '-';
        this.elements.input.value = '';
        this.updateDisplay();
        this.showMessage('Reset completed', 'success');
    }
    
    updateDisplay() {
        this.elements.sizeValue.textContent = this.data.length;
        this.elements.capacityText.textContent = `${this.data.length}/${this.maxSize}`;
        
        if (this.data.length === 0) {
            this.elements.topValue.textContent = '-';
        } else {
            this.elements.topValue.textContent = this.mode === 'stack' ? 
                this.data[this.data.length - 1] : this.data[0];
        }
    }
    
    showMessage(text, type = 'success') {
        this.elements.message.textContent = text;
        this.elements.message.className = `message ${type}`;
        
        if (type === 'error') {
            setTimeout(() => {
                this.elements.message.classList.remove('error');
            }, 3000);
        }
    }
    
    disableButtons() {
        [this.elements.pushBtn, this.elements.popBtn, this.elements.peekBtn, 
         this.elements.resetBtn].forEach(btn => {
            btn.disabled = true;
            btn.classList.add('disable-button');
        });
        this.elements.input.disabled = true;
    }
    
    enableButtons() {
        [this.elements.pushBtn, this.elements.popBtn, this.elements.peekBtn, 
         this.elements.resetBtn].forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('disable-button');
        });
        this.elements.input.disabled = false;
    }
}

// Initialize the visualizer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DataStructureVisualizer();
});
