(function ($) {
  let activeEditorInstance = null;
  const emojis = ['😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','🙃','😉','😌','😍','🥰','😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🤩','🥳','😏','😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','🥺','😢','😭','😤','😠','😡','🤬','🤯','😳','🥵','🥶','😱','😨','😰','😥','😓','🤗','🤔','🤭','🤫','🤥','😶','😐','😑','😬','🙄','😯','😦','😧','😮','😲','🥱','😴','🤤','😪','😵','🤐','🥴','🤢','🤮','🤧','😷','🤒','🤕','🤑','🤠','😈','👿','👹','👺','🤡','💩','👻','💀','☠️','👽','👾','🤖','🎃','😺','😸','😹','😻','😼','😽','🙀','😿','😾'];

  $.fn.ranjitEditor = function (options = {}) {
    // Prevent duplicate initialization
    if (this.hasClass('ranjit-editor-initialized')) {
      return this;
    }
    
    const settings = $.extend({
      autosave: true,
      wordCount: true,
      darkMode: false,
      fullscreen: true,
      emoji: true,
      autosaveInterval: 5000
    }, options);

    const generateId = () => "ranjit-" + Math.random().toString(36).substr(2, 9);

    const editorTemplate = `
      <div class="ranjit-editor-container">
        <div class="ranjit-editor-toolbar">
          <div class="tool-group">
            <button type="button" class="tool-button" data-command="undo" title="Undo (Ctrl+Z)"><i class="fas fa-undo"></i></button>
            <button type="button" class="tool-button" data-command="redo" title="Redo (Ctrl+Y)"><i class="fas fa-redo"></i></button>
          </div>
          <div class="tool-group">
            <select class="tool-select" data-command="formatBlock">
              <option value="P">Paragraph</option>
              <option value="H1">H1</option>
              <option value="H2">H2</option>
              <option value="H3">H3</option>
              <option value="H4">H4</option>
              <option value="H5">H5</option>
              <option value="H6">H6</option>
              <option value="BLOCKQUOTE">Quote</option>
              <option value="PRE">Code Block</option>
            </select>
          </div>
          <div class="tool-group">
            <select class="tool-select" data-command="fontName">
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
              <option value="Courier New">Courier New</option>
              <option value="Impact">Impact</option>
            </select>
          </div>
          <div class="tool-group">
            <select class="tool-select" data-command="fontSize">
              <option value="1">8pt</option>
              <option value="2">10pt</option>
              <option value="3" selected>12pt</option>
              <option value="4">14pt</option>
              <option value="5">18pt</option>
              <option value="6">24pt</option>
              <option value="7">36pt</option>
            </select>
          </div>
          <div class="tool-group">
            <button type="button" class="tool-button" data-command="bold" title="Bold (Ctrl+B)"><i class="fas fa-bold"></i></button>
            <button type="button" class="tool-button" data-command="italic" title="Italic (Ctrl+I)"><i class="fas fa-italic"></i></button>
            <button type="button" class="tool-button" data-command="underline" title="Underline (Ctrl+U)"><i class="fas fa-underline"></i></button>
            <button type="button" class="tool-button" data-command="strikeThrough" title="Strikethrough"><i class="fas fa-strikethrough"></i></button>
          </div>
          <div class="tool-group">
            <div class="tool-dropdown" title="Text Effects">
              <button type="button" class="tool-button dropdown-toggle" data-command="toggleTextEffects">
                <i class="fas fa-subscript"></i>
                <i class="fas fa-chevron-down dropdown-arrow"></i>
              </button>
              <div class="dropdown-menu" id="textEffectsMenu">
                <div class="dropdown-section">
                  <div class="dropdown-header">📝 Text Effects</div>
                  <button class="dropdown-item" data-command="subscript"><i class="fas fa-subscript"></i> Subscript</button>
                  <button class="dropdown-item" data-command="superscript"><i class="fas fa-superscript"></i> Superscript</button>
                </div>
              </div>
            </div>
          </div>
          <div class="tool-group">
            <div class="tool-color-picker" title="Text Color">
              <i class="fas fa-font"></i>
              <input type="color" class="color-input" data-command="foreColor" value="#000000">
            </div>
            <div class="tool-color-picker" title="Background Color">
              <i class="fas fa-fill-drip"></i>
              <input type="color" class="color-input" data-command="hiliteColor" value="#ffff00">
            </div>
          </div>
          <div class="tool-group">
            <div class="tool-dropdown" title="Text Alignment">
              <button type="button" class="tool-button dropdown-toggle" data-command="toggleAlignment">
                <i class="fas fa-align-left"></i>
                <i class="fas fa-chevron-down dropdown-arrow"></i>
              </button>
              <div class="dropdown-menu" id="alignmentMenu">
                <div class="dropdown-section">
                  <div class="dropdown-header">📐 Text Alignment</div>
                  <button class="dropdown-item" data-command="justifyLeft"><i class="fas fa-align-left"></i> Align Left</button>
                  <button class="dropdown-item" data-command="justifyCenter"><i class="fas fa-align-center"></i> Align Center</button>
                  <button class="dropdown-item" data-command="justifyRight"><i class="fas fa-align-right"></i> Align Right</button>
                  <button class="dropdown-item" data-command="justifyFull"><i class="fas fa-align-justify"></i> Justify</button>
                </div>
              </div>
            </div>
          </div>
          <div class="tool-group">
            <button type="button" class="tool-button" data-command="insertUnorderedList" title="Bullet List"><i class="fas fa-list-ul"></i></button>
            <button type="button" class="tool-button" data-command="insertOrderedList" title="Numbered List"><i class="fas fa-list-ol"></i></button>
            <button type="button" class="tool-button" data-command="outdent" title="Decrease Indent"><i class="fas fa-outdent"></i></button>
            <button type="button" class="tool-button" data-command="indent" title="Increase Indent"><i class="fas fa-indent"></i></button>
          </div>
          <div class="tool-group">
            <button type="button" class="tool-button" data-command="createLink" title="Insert Link"><i class="fas fa-link"></i></button>
            <button type="button" class="tool-button" data-command="unlink" title="Remove Link"><i class="fas fa-unlink"></i></button>
            <div class="tool-dropdown" title="Insert Image">
              <button type="button" class="tool-button dropdown-toggle" data-command="insertImageDirect">
                <i class="fas fa-image"></i>
              </button>
              <div class="dropdown-menu" id="imageInsertMenu">
                <div class="dropdown-section">
                  <div class="dropdown-header">📁 Upload Image</div>
                  <button class="dropdown-item" data-command="insertImageDirect"><i class="fas fa-upload"></i> Upload from Computer</button>
                  <button class="dropdown-item" data-command="insertImageUrl"><i class="fas fa-link"></i> Insert from URL</button>
                </div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-section">
                  <div class="dropdown-header">⚙️ Advanced</div>
                  <button class="dropdown-item" data-command="insertImageAdvanced"><i class="fas fa-cog"></i> Advanced Options</button>
                  <button class="dropdown-item" data-command="replaceSelectedImage"><i class="fas fa-exchange-alt"></i> Replace Selected Image</button>
                  <button class="dropdown-item" data-command="updateImageUrl"><i class="fas fa-edit"></i> Update Image URL</button>
                </div>
              </div>
            </div>
            <button type="button" class="tool-button" data-command="insertVideo" title="Insert Video"><i class="fas fa-video"></i></button>
            <button type="button" class="tool-button" data-command="insertTable" title="Insert Table"><i class="fas fa-table"></i></button>
            <button type="button" class="tool-button" data-command="insertGallery" title="Insert Gallery"><i class="fas fa-images"></i></button>
          </div>
          <div class="tool-group">
            <button type="button" class="tool-button" data-command="insertHorizontalRule" title="Horizontal Line"><i class="fas fa-minus"></i></button>
            <button type="button" class="tool-button" data-command="showEmoji" title="Insert Emoji"><i class="fas fa-smile"></i></button>
            <button type="button" class="tool-button" data-command="insertDateTime" title="Insert Date/Time"><i class="fas fa-clock"></i></button>
          </div>
          <div class="tool-group">
            <button type="button" class="tool-button" data-command="removeFormat" title="Clear Formatting"><i class="fas fa-remove-format"></i></button>
            <button type="button" class="tool-button" data-command="selectAll" title="Select All (Ctrl+A)"><i class="fas fa-check-square"></i></button>
          </div>
          <div class="tool-group">
            <div class="tool-dropdown" title="Import/Export">
              <button type="button" class="tool-button dropdown-toggle" data-command="toggleImportExport">
                <i class="fas fa-file-export"></i>
                <i class="fas fa-chevron-down dropdown-arrow"></i>
              </button>
              <div class="dropdown-menu" id="importExportMenu">
                <div class="dropdown-section">
                  <div class="dropdown-header">📥 Import</div>
                  <button class="dropdown-item" data-command="importWord"><i class="fas fa-file-word"></i> Import from Word</button>
                  <button class="dropdown-item" data-command="importText"><i class="fas fa-file-alt"></i> Import Text File</button>
                </div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-section">
                  <div class="dropdown-header">📤 Export</div>
                  <button class="dropdown-item" data-command="exportWord"><i class="fas fa-file-word"></i> Export to Word</button>
                  <button class="dropdown-item" data-command="exportPdf"><i class="fas fa-file-pdf"></i> Export to PDF</button>
                  <button class="dropdown-item" data-command="exportHtml"><i class="fas fa-code"></i> Export HTML</button>
                  <button class="dropdown-item" data-command="exportText"><i class="fas fa-file-alt"></i> Export Text</button>
                </div>
              </div>
            </div>
            <button type="button" class="tool-button" data-command="findReplace" title="Find & Replace (Ctrl+F)"><i class="fas fa-search"></i></button>
            <button type="button" class="tool-button" data-command="toggleCode" title="HTML Source"><i class="fas fa-code"></i></button>
            <button type="button" class="tool-button" data-command="toggleFullscreen" title="Fullscreen"><i class="fas fa-expand"></i></button>
            <button type="button" class="tool-button" data-command="showSettings" title="Editor Settings"><i class="fas fa-cog"></i></button>
            <button type="button" class="tool-button" data-command="showHelp" title="Help"><i class="fas fa-question-circle"></i></button>
          </div>
        </div>
        <div class="ranjit-editor-content" contenteditable="true" data-placeholder="Start writing your content here..."></div>
        <div class="ranjit-editor-footer">
          <div class="editor-status">
            <span class="word-count">Words: 0</span>
            <span class="char-count">Characters: 0</span>
            <span class="autosave-status">Ready</span>
          </div>
          <div class="editor-copyright">
            <span>© ${new Date().getFullYear()} by <a href="https://github.com/ranjitraut-sta" target="_blank">Ranjit Raut</a></span>
          </div>
        </div>
        <div class="ranjit-editor-code-wrapper">
          <div class="ranjit-editor-code-toolbar">
            <span>HTML Source Code</span>
            <button type="button" class="tool-button" data-command="toggleCode" title="Visual Editor"><i class="fas fa-eye"></i> Visual</button>
          </div>
          <textarea class="ranjit-editor-code"></textarea>
        </div>
      </div>
    `;

    return this.each(function () {
      // Ensure required elements exist before initializing
      ensureRequiredElements();
      
      const $originalTextarea = $(this);
      const $editor = $(editorTemplate);
      const editorId = generateId();
      
      const $contentArea = $editor.find(".ranjit-editor-content");
      const $codeArea = $editor.find(".ranjit-editor-code");
      const $toolbar = $editor.find(".ranjit-editor-toolbar");
      const $wordCount = $editor.find(".word-count");
      const $charCount = $editor.find(".char-count");
      const $autosaveStatus = $editor.find(".autosave-status");
      
      let history = [];
      let historyIndex = -1;
      let autosaveTimer;
      
      const instance = {
        $editor: $editor,
        $contentArea: $contentArea,
        settings: settings,
        
        exec: (command, value = null) => {
          if (command === 'undo' || command === 'redo') {
            document.execCommand(command, false, value);
          } else {
            instance.saveState();
            document.execCommand(command, false, value);
          }
          $contentArea.focus();
          instance.updateToolbar();
          instance.updateCounts();
        },
        
        saveState: () => {
          const content = $contentArea.html();
          if (history[historyIndex] !== content) {
            history = history.slice(0, historyIndex + 1);
            history.push(content);
            historyIndex++;
            if (history.length > 50) {
              history.shift();
              historyIndex--;
            }
          }
        },
        
        undo: () => {
          if (historyIndex > 0) {
            historyIndex--;
            $contentArea.html(history[historyIndex]);
            instance.updateCounts();
          }
        },
        
        redo: () => {
          if (historyIndex < history.length - 1) {
            historyIndex++;
            $contentArea.html(history[historyIndex]);
            instance.updateCounts();
          }
        },
        
        updateCounts: () => {
          if (settings.wordCount) {
            const text = $contentArea.text();
            const words = text.trim() ? text.trim().split(/\s+/).length : 0;
            const chars = text.length;
            $wordCount.text(`Words: ${words}`);
            $charCount.text(`Characters: ${chars}`);
          }
        },
        
        autosave: () => {
          if (settings.autosave) {
            const cleanContent = getCleanHTML(instance);
            $originalTextarea.val(cleanContent);
            
            // Prevent localStorage quota exceeded error
            try {
              // Limit content size to prevent quota issues
              const contentToStore = cleanContent.length > 50000 ? 
                cleanContent.substring(0, 50000) + '...[content truncated]' : 
                cleanContent;
              localStorage.setItem(`ranjit-editor-${editorId}`, contentToStore);
              $autosaveStatus.text('Saved').addClass('saved');
            } catch (e) {
              console.warn('Autosave failed:', e.message);
              $autosaveStatus.text('Save Failed').removeClass('saved');
            }
            
            setTimeout(() => {
              $autosaveStatus.text('Ready').removeClass('saved');
            }, 2000);
          }
        },
        
        saveSelection: () => {
          if (window.getSelection) {
            const sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) return sel.getRangeAt(0);
          }
          return null;
        },
        
        restoreSelection: (range) => {
          if (range && window.getSelection) {
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
          }
        },
        
        updateToolbar: () => {
          $toolbar.find("[data-command]").each(function () {
            const command = $(this).data("command");
            if (document.queryCommandState && document.queryCommandState(command)) {
              $(this).addClass("is-active");
            } else {
              $(this).removeClass("is-active");
            }
          });
        },
        
        toggleFullscreen: () => {
          $editor.toggleClass('fullscreen-mode');
          const isFullscreen = $editor.hasClass('fullscreen-mode');
          $toolbar.find('[data-command="toggleFullscreen"] i')
            .toggleClass('fa-expand', !isFullscreen)
            .toggleClass('fa-compress', isFullscreen);
        },
        
        insertEmoji: (emoji) => {
          instance.exec('insertText', emoji);
        }
      };

      // Setup
      $originalTextarea.hide().after($editor).addClass('ranjit-editor-initialized');
      
      // Load content with error handling
      let savedContent = null;
      try {
        savedContent = localStorage.getItem(`ranjit-editor-${editorId}`);
      } catch (e) {
        console.warn('Failed to load saved content:', e.message);
      }
      const initialContent = savedContent || $originalTextarea.val();
      $contentArea.html(initialContent);
      instance.saveState();
      instance.updateCounts();
      
      // Initialize color picker indicators
      $editor.find('.color-input').each(function() {
        const $colorPicker = $(this).closest('.tool-color-picker');
        const value = $(this).val();
        $colorPicker.css('--current-color', value);
      });
      
      // Load and apply saved settings
      setTimeout(() => {
        const settings = loadEditorSettings();
        if (activeEditorInstance) {
          activeEditorInstance.settings = {...activeEditorInstance.settings, ...settings};
        }
      }, 100);
      
      // Drag and drop support
      $contentArea.on('dragover', (e) => {
        e.preventDefault();
        $contentArea.addClass('drag-over');
      }).on('dragleave', () => {
        $contentArea.removeClass('drag-over');
      }).on('drop', (e) => {
        e.preventDefault();
        $contentArea.removeClass('drag-over');
        const files = Array.from(e.originalEvent.dataTransfer.files).filter(file => file.type.startsWith('image/'));
        
        if (files.length === 1) {
          // Single image - show image builder
          activeEditorInstance = instance;
          showImageBuilder(instance);
          setTimeout(() => {
            handleSingleDroppedImage(files[0]);
          }, 100);
        } else if (files.length > 1) {
          // Multiple images - show gallery builder
          activeEditorInstance = instance;
          showImageBuilder(instance);
          setTimeout(() => {
            $('.upload-mode-btn[data-mode="multiple"]').click();
            handleMultipleFiles(files);
          }, 100);
        }
      });
      
      // Content sync and autosave
      $contentArea.on("input keyup paste", () => {
        const cleanContent = getCleanHTML(instance);
        $originalTextarea.val(cleanContent);
        instance.updateCounts();
        $autosaveStatus.text('Modified').removeClass('saved');
        
        if (settings.autosave) {
          clearTimeout(autosaveTimer);
          autosaveTimer = setTimeout(instance.autosave, settings.autosaveInterval);
        }
      });
      
      // Keyboard shortcuts
      $contentArea.on('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
          switch(e.key) {
            case 'z': e.preventDefault(); instance.undo(); break;
            case 'y': e.preventDefault(); instance.redo(); break;
            case 'b': e.preventDefault(); instance.exec('bold'); break;
            case 'i': e.preventDefault(); instance.exec('italic'); break;
            case 'u': e.preventDefault(); instance.exec('underline'); break;
            case 's': e.preventDefault(); instance.autosave(); break;
            case 'f': e.preventDefault(); showFindReplace(instance); break;
            case 'a': e.preventDefault(); instance.exec('selectAll'); break;
          }
        }
      });
      
      $contentArea.on("keyup mouseup focus", () => {
        activeEditorInstance = instance;
        instance.updateToolbar();
      });

      // Separate event handling for buttons and selects
      $editor.find(".tool-button").on("click", function (e) {
        e.preventDefault();
        activeEditorInstance = instance;
        const command = $(this).data("command");
        const selection = instance.saveSelection();
        handleCommand(command, null, selection);
      });
      
      $editor.find(".tool-select").on("change", function (e) {
        activeEditorInstance = instance;
        const command = $(this).data("command");
        const value = $(this).val();
        const selection = instance.saveSelection();
        handleCommand(command, value, selection);
      });
      
      // Color picker events
      $editor.find('.color-input').on('change input', function() {
        activeEditorInstance = instance;
        const command = $(this).data('command');
        const value = $(this).val();
        const $colorPicker = $(this).closest('.tool-color-picker');
        
        // Update visual indicator
        $colorPicker.css('--current-color', value);
        
        $contentArea.focus();
        
        // Apply color immediately
        if (command === 'foreColor') {
          document.execCommand('styleWithCSS', false, true);
          document.execCommand('foreColor', false, value);
        } else if (command === 'hiliteColor' || command === 'backColor') {
          document.execCommand('styleWithCSS', false, true);
          document.execCommand('hiliteColor', false, value);
        }
        
        instance.updateCounts();
      });
      
      // Color picker click to focus editor first
      $editor.find('.tool-color-picker').on('click', function() {
        $contentArea.focus();
      });
      
      function handleCommand(command, value, selection) {

          switch (command) {
          case 'undo': instance.undo(); break;
          case 'redo': instance.redo(); break;
          
          case "createLink": {
            instance.restoreSelection(selection);
            showLinkBuilder(instance, selection);
            break;
          }
          
          case "insertImageDirect": {
            openDirectImageUpload(instance);
            break;
          }
          
          case "insertImageAdvanced": {
            showImageBuilder(instance);
            break;
          }
          
          case "insertImageUrl": {
            const url = prompt('Enter image URL:', 'https://');
            if (url && url !== 'https://') {
              const imageData = {
                src: url,
                size: 50,
                align: 'center',
                display: 'block',
                alt: 'Image from URL'
              };
              insertImage(instance, imageData);
              showNotification('Image inserted from URL!');
            }
            break;
          }
          
          case "replaceSelectedImage": {
            const $selectedImage = instance.$contentArea.find('.image-figure.selected img');
            if ($selectedImage.length) {
              replaceImage($selectedImage);
            } else {
              alert('Please select an image first by clicking on it.');
            }
            break;
          }
          
          case "updateImageUrl": {
            const $selectedImage = instance.$contentArea.find('.image-figure.selected img');
            if ($selectedImage.length) {
              const currentUrl = $selectedImage.attr('src');
              const newUrl = prompt('Enter new image URL:', currentUrl);
              if (newUrl && newUrl !== currentUrl) {
                $selectedImage.attr('src', newUrl);
                const settings = loadEditorSettings();
          if (settings.showImageSuccess) {
            showNotification('Image URL updated!');
          }
              }
            } else {
              alert('Please select an image first by clicking on it.');
            }
            break;
          }
          
          case "insertVideo": {
            showVideoBuilder(instance);
            break;
          }
          
          case "insertTable": {
            instance.restoreSelection(selection);
            showTableBuilder(instance);
            break;
          }
          
          case "insertGallery": {
            showImageBuilder(instance);
            // Auto-switch to multiple mode
            setTimeout(() => {
              $('.upload-mode-btn[data-mode="multiple"]').click();
            }, 100);
            break;
          }
          
          case "insertDateTime": {
            const now = new Date();
            const dateTime = now.toLocaleString();
            instance.exec('insertText', dateTime);
            break;
          }
          
          case "showEmoji": {
            let emojiHtml = '<div class="emoji-grid">';
            emojis.forEach(emoji => {
              emojiHtml += `<span class="emoji-item" data-emoji="${emoji}">${emoji}</span>`;
            });
            emojiHtml += '</div>';
            
            $("#ranjitEmojiModal").html(`
              <div class="ranjit-modal-content">
                <span class="ranjit-modal-close">&times;</span>
                <h3>Select Emoji</h3>
                ${emojiHtml}
              </div>
            `).css("display", "flex");
            break;
          }
          
          case "toggleCode": {
            $editor.toggleClass("code-view-active");
            if ($editor.hasClass("code-view-active")) {
              $codeArea.val($contentArea.html());
            } else {
              $contentArea.html($codeArea.val()).focus();
              instance.updateCounts();
            }
            break;
          }
          
          case "toggleFullscreen": {
            instance.toggleFullscreen();
            break;
          }
          
          case "selectAll": {
            instance.exec('selectAll');
            break;
          }
          
          case "toggleTextEffects": {
            const $menu = $(this).closest('.tool-dropdown').find('.dropdown-menu');
            $('.dropdown-menu').not($menu).hide();
            $menu.toggle();
            break;
          }
          
          case "toggleAlignment": {
            const $menu = $(this).closest('.tool-dropdown').find('.dropdown-menu');
            $('.dropdown-menu').not($menu).hide();
            $menu.toggle();
            break;
          }
          
          case "subscript": {
            instance.exec('subscript');
            break;
          }
          
          case "superscript": {
            instance.exec('superscript');
            break;
          }
          
          case "toggleImportExport": {
            const $menu = $(this).closest('.tool-dropdown').find('.dropdown-menu');
            $('.dropdown-menu').not($menu).hide();
            $menu.toggle();
            break;
          }
          
          case "importWord":
          case "importText": {
            console.log('Import command:', command);
            handleImport(instance, command);
            break;
          }
          
          case "exportWord":
          case "exportPdf":
          case "exportHtml":
          case "exportText": {
            console.log('Export command:', command);
            handleExport(instance, command);
            break;
          }
          
          case "getStyledHTML": {
            const styledHTML = instance.getStyledHTML();
            navigator.clipboard.writeText(styledHTML).then(() => {
              showNotification('Styled HTML copied to clipboard!');
            });
            break;
          }
          
          case "findReplace": {
            showFindReplace(instance);
            break;
          }
          
          case "showSettings": {
            showSettingsOffCanvas();
            break;
          }
          
          case "showHelp": {
            $("#ranjitHelpModal").html(`
              <div class="ranjit-modal-content">
                <span class="ranjit-modal-close">&times;</span>
                <h3>Advanced Features</h3>
                <div class="help-content">
                  <h4>Keyboard Shortcuts:</h4>
                  <ul>
                    <li><strong>Ctrl+B</strong> - Bold</li>
                    <li><strong>Ctrl+I</strong> - Italic</li>
                    <li><strong>Ctrl+U</strong> - Underline</li>
                    <li><strong>Ctrl+Z</strong> - Undo</li>
                    <li><strong>Ctrl+Y</strong> - Redo</li>
                    <li><strong>Ctrl+S</strong> - Save</li>
                    <li><strong>Ctrl+F</strong> - Find & Replace</li>
                  </ul>
                  <h4>Features:</h4>
                  <ul>
                    <li>Auto-save every 5 seconds</li>
                    <li>Drag & drop image upload</li>
                    <li>Word and character count</li>
                    <li>Fullscreen editing mode</li>
                    <li>Emoji picker</li>
                    <li>Find & replace functionality</li>
                    <li>Advanced formatting options</li>
                    <li>When you right-click on the table, its controls will appear.</li>
                  </ul>
                </div>
              </div>
            `).css("display", "flex");
            break;
          }
          
            case "formatBlock":
            case "fontName":
            case "fontSize":
              if (value) {
                instance.restoreSelection(selection);
                instance.exec(command, value);
              }
              break;
              
            case "foreColor":
            case "hiliteColor":
              if (value) {
                instance.restoreSelection(selection);
                document.execCommand('styleWithCSS', false, true);
                instance.exec(command, value);
              }
              break;
            
            default: {
              instance.exec(command, value);
            }
          }
        }
    });
  };

  // Auto-create required elements if they don't exist
  function ensureRequiredElements() {
    if (!$('#ranjitImageUpload').length) {
      $('body').append('<input type="file" id="ranjitImageUpload" accept="image/*" style="display: none;">');
    }
    if (!$('#ranjitHelpModal').length) {
      $('body').append('<div id="ranjitHelpModal" class="ranjit-modal-overlay"></div>');
    }
    if (!$('#ranjitEmojiModal').length) {
      $('body').append('<div id="ranjitEmojiModal" class="ranjit-modal-overlay"></div>');
    }
    if (!$('#ranjitTableModal').length) {
      $('body').append('<div id="ranjitTableModal" class="ranjit-modal-overlay"></div>');
    }
    if (!$('#ranjitImageModal').length) {
      $('body').append('<div id="ranjitImageModal" class="ranjit-modal-overlay"></div>');
    }
    if (!$('#ranjitVideoModal').length) {
      $('body').append('<div id="ranjitVideoModal" class="ranjit-modal-overlay"></div>');
    }
    if (!$('#ranjitFindReplaceModal').length) {
      $('body').append('<div id="ranjitFindReplaceModal" class="ranjit-modal-overlay"></div>');
    }
    if (!$('#ranjitLinkModal').length) {
      $('body').append('<div id="ranjitLinkModal" class="ranjit-modal-overlay"></div>');
    }
    if (!$('#ranjitImportFileInput').length) {
      $('body').append('<input type="file" id="ranjitImportFileInput" accept=".docx,.doc,.txt,.html" style="display: none;">');
    }
    if (!$('#ranjitSettingsModal').length) {
      $('body').append('<div id="ranjitSettingsModal" class="ranjit-modal-overlay"></div>');
    }
  }
  
  // Apply editor settings
  function applyEditorSettings() {
    const settings = {
      textEffects: $('#enableTextEffects').is(':checked'),
      imageInsert: $('#enableImageInsert').is(':checked'),
      galleryInsert: $('#enableGalleryInsert').is(':checked'),
      advancedTable: $('#enableAdvancedTable').is(':checked'),
      videoInsert: $('#enableVideoInsert').is(':checked'),
      importExport: $('#enableImportExport').is(':checked'),
      autosave: $('#enableAutosave').is(':checked'),
      wordCount: $('#enableWordCount').is(':checked'),
      emoji: $('#enableEmoji').is(':checked'),
      search: $('#enableSearch').is(':checked'),
      fullscreen: $('#enableFullscreen').is(':checked'),
      selectAll: $('#enableSelectAll').is(':checked'),
      dateTime: $('#enableDateTime').is(':checked'),
      horizontalRule: $('#enableHorizontalRule').is(':checked'),
      showImageSuccess: $('#enableImageSuccess').is(':checked')
    };
    
    // Save to localStorage
    localStorage.setItem('ranjit-editor-settings', JSON.stringify(settings));
    
    // Apply settings to UI
    $('.tool-dropdown[title="Text Effects"]').toggle(settings.textEffects);
    $('.tool-dropdown[title="Insert Image"]').toggle(settings.imageInsert);
    $('.tool-button[data-command="insertGallery"]').toggle(settings.galleryInsert);
    $('.tool-button[data-command="insertTable"]').toggle(settings.advancedTable);
    $('.tool-button[data-command="insertVideo"]').toggle(settings.videoInsert);
    $('.tool-dropdown[title="Import/Export"]').toggle(settings.importExport);
    $('.tool-button[data-command="showEmoji"]').toggle(settings.emoji);
    $('.tool-button[data-command="findReplace"]').toggle(settings.search);
    $('.tool-button[data-command="toggleFullscreen"]').toggle(settings.fullscreen);
    $('.tool-button[data-command="selectAll"]').toggle(settings.selectAll);
    $('.tool-button[data-command="insertDateTime"]').toggle(settings.dateTime);
    $('.tool-button[data-command="insertHorizontalRule"]').toggle(settings.horizontalRule);
    
    // Update editor settings
    if (activeEditorInstance) {
      activeEditorInstance.settings.autosave = settings.autosave;
      activeEditorInstance.settings.wordCount = settings.wordCount;
      activeEditorInstance.settings.emoji = settings.emoji;
      
      // Toggle word count display
      $('.editor-status').toggle(settings.wordCount);
    }
    
    showNotification('Settings saved successfully!');
  }
  
  // Load editor settings from localStorage
  function loadEditorSettings() {
    const savedSettings = localStorage.getItem('ranjit-editor-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      
      // Apply to UI immediately
      $('.tool-dropdown[title="Text Effects"]').toggle(settings.textEffects === true);
      $('.tool-dropdown[title="Insert Image"]').toggle(settings.imageInsert === true);
      $('.tool-button[data-command="insertGallery"]').toggle(settings.galleryInsert === true);
      $('.tool-button[data-command="insertTable"]').toggle(settings.advancedTable === true);
      $('.tool-button[data-command="insertVideo"]').toggle(settings.videoInsert === true);
      $('.tool-dropdown[title="Import/Export"]').toggle(settings.importExport === true);
      $('.tool-button[data-command="showEmoji"]').toggle(settings.emoji === true);
      $('.tool-button[data-command="findReplace"]').toggle(settings.search === true);
      $('.tool-button[data-command="toggleFullscreen"]').toggle(settings.fullscreen === true);
      $('.tool-button[data-command="selectAll"]').toggle(settings.selectAll === true);
      $('.tool-button[data-command="insertDateTime"]').toggle(settings.dateTime === true);
      $('.tool-button[data-command="insertHorizontalRule"]').toggle(settings.horizontalRule === true);
      $('.editor-status').toggle(settings.wordCount === true);
      
      return settings;
    }
    
    // Default settings - table and image insert enabled by default
    return {
      textEffects: false,
      imageInsert: true,
      galleryInsert: false,
      advancedTable: true,
      videoInsert: false,
      importExport: false,
      autosave: false,
      wordCount: false,
      emoji: false,
      search: false,
      fullscreen: false,
      selectAll: false,
      dateTime: false,
      horizontalRule: false,
      showImageSuccess: false
    };
  }
  
  // Reset editor settings
  function resetEditorSettings() {
    $('#enableTextEffects, #enableImageInsert, #enableGalleryInsert, #enableAdvancedTable, #enableVideoInsert, #enableImportExport, #enableAutosave, #enableWordCount, #enableEmoji, #enableSearch, #enableFullscreen, #enableSelectAll, #enableDateTime, #enableHorizontalRule, #enableImageSuccess').prop('checked', false);
    applyEditorSettings();
    showNotification('Settings reset to default!');
  }
  
  // Show settings off-canvas with tabs
  function showSettingsOffCanvas() {
    const savedSettings = loadEditorSettings();
    
    const offCanvasHtml = `
      <div class="ranjit-offcanvas-overlay" id="settingsOffCanvas">
        <div class="ranjit-offcanvas-content">
          <div class="ranjit-offcanvas-header">
            <h3>⚙️ Editor Settings</h3>
            <button class="ranjit-offcanvas-close" id="closeSettings">&times;</button>
          </div>
          
          <div class="settings-tabs">
            <button class="tab-btn ranjit-active" data-tab="toolbar">🛠️ Toolbar Features</button>
            <button class="tab-btn" data-tab="preferences">🎨 Editor Preferences</button>
            <button class="tab-btn" data-tab="notifications">🔔 Notifications</button>
          </div>
          
          <div class="ranjit-offcanvas-body">
            <div class="ranjit-tab-content ranjit-active" id="toolbar-tab">
              <div class="settings-list">
                <label class="setting-toggle">
                  <input type="checkbox" id="enableTextEffects" ${savedSettings.textEffects ? 'checked' : ''}>
                  <span class="toggle-switch"></span>
                  <div class="toggle-info">
                    <strong>📝 Text Effects</strong>
                    <small>Sub/Superscript options</small>
                  </div>
                </label>
                <label class="setting-toggle">
                  <input type="checkbox" id="enableImageInsert" ${savedSettings.imageInsert ? 'checked' : ''}>
                  <span class="toggle-switch"></span>
                  <div class="toggle-info">
                    <strong>🖼️ Image Insert</strong>
                    <small>Upload and insert single images</small>
                  </div>
                </label>
                <label class="setting-toggle">
                  <input type="checkbox" id="enableGalleryInsert" ${savedSettings.galleryInsert ? 'checked' : ''}>
                  <span class="toggle-switch"></span>
                  <div class="toggle-info">
                    <strong>🖼️ Gallery Insert</strong>
                    <small>Upload and create image galleries</small>
                  </div>
                </label>
                <label class="setting-toggle">
                  <input type="checkbox" id="enableAdvancedTable" ${savedSettings.advancedTable ? 'checked' : ''}>
                  <span class="toggle-switch"></span>
                  <div class="toggle-info">
                    <strong>📋 Advanced Tables</strong>
                    <small>Sortable, editable tables</small>
                  </div>
                </label>
                <label class="setting-toggle">
                  <input type="checkbox" id="enableVideoInsert" ${savedSettings.videoInsert ? 'checked' : ''}>
                  <span class="toggle-switch"></span>
                  <div class="toggle-info">
                    <strong>🎥 Video Insert</strong>
                    <small>YouTube, Vimeo support</small>
                  </div>
                </label>
                <label class="setting-toggle">
                  <input type="checkbox" id="enableImportExport" ${savedSettings.importExport ? 'checked' : ''}>
                  <span class="toggle-switch"></span>
                  <div class="toggle-info">
                    <strong>📁 Import/Export</strong>
                    <small>Word, PDF, HTML export</small>
                  </div>
                </label>
                <label class="setting-toggle">
                  <input type="checkbox" id="enableSearch" ${savedSettings.search ? 'checked' : ''}>
                  <span class="toggle-switch"></span>
                  <div class="toggle-info">
                    <strong>🔍 Find & Replace</strong>
                    <small>Search and replace text</small>
                  </div>
                </label>
                <label class="setting-toggle">
                  <input type="checkbox" id="enableFullscreen" ${savedSettings.fullscreen ? 'checked' : ''}>
                  <span class="toggle-switch"></span>
                  <div class="toggle-info">
                    <strong>🔲 Fullscreen Mode</strong>
                    <small>Distraction-free editing</small>
                  </div>
                </label>
                <label class="setting-toggle">
                  <input type="checkbox" id="enableSelectAll" ${savedSettings.selectAll ? 'checked' : ''}>
                  <span class="toggle-switch"></span>
                  <div class="toggle-info">
                    <strong>☑️ Select All</strong>
                    <small>Quick text selection</small>
                  </div>
                </label>
                <label class="setting-toggle">
                  <input type="checkbox" id="enableDateTime" ${savedSettings.dateTime ? 'checked' : ''}>
                  <span class="toggle-switch"></span>
                  <div class="toggle-info">
                    <strong>🕐 Date/Time Insert</strong>
                    <small>Insert current date and time</small>
                  </div>
                </label>
                <label class="setting-toggle">
                  <input type="checkbox" id="enableHorizontalRule" ${savedSettings.horizontalRule ? 'checked' : ''}>
                  <span class="toggle-switch"></span>
                  <div class="toggle-info">
                    <strong>➖ Horizontal Line</strong>
                    <small>Insert horizontal divider line</small>
                  </div>
                </label>
              </div>
            </div>
            
            <div class="ranjit-tab-content" id="preferences-tab">
              <div class="settings-list">
                <label class="setting-toggle">
                  <input type="checkbox" id="enableAutosave" ${savedSettings.autosave ? 'checked' : ''}>
                  <span class="toggle-switch"></span>
                  <div class="toggle-info">
                    <strong>💾 Auto-save</strong>
                    <small>Save every 5 seconds</small>
                  </div>
                </label>
                <label class="setting-toggle">
                  <input type="checkbox" id="enableWordCount" ${savedSettings.wordCount ? 'checked' : ''}>
                  <span class="toggle-switch"></span>
                  <div class="toggle-info">
                    <strong>🔢 Word Count</strong>
                    <small>Show word/character count</small>
                  </div>
                </label>
                <label class="setting-toggle">
                  <input type="checkbox" id="enableEmoji" ${savedSettings.emoji ? 'checked' : ''}>
                  <span class="toggle-switch"></span>
                  <div class="toggle-info">
                    <strong>😀 Emoji Picker</strong>
                    <small>Insert emojis easily</small>
                  </div>
                </label>
              </div>
            </div>
            
            <div class="ranjit-tab-content" id="notifications-tab">
              <div class="settings-list">
                <label class="setting-toggle">
                  <input type="checkbox" id="enableImageSuccess" ${savedSettings.showImageSuccess ? 'checked' : ''}>
                  <span class="toggle-switch"></span>
                  <div class="toggle-info">
                    <strong>🖼️ Image Upload Success</strong>
                    <small>Show "Image inserted successfully" message</small>
                  </div>
                </label>
              </div>
            </div>
          </div>
          
          <div class="ranjit-offcanvas-footer">
            <button class="settings-btn ranjit-primary" id="applySettings">✓ Apply Settings</button>
            <button class="settings-btn" id="resetSettings">🔄 Reset Default</button>
          </div>
        </div>
      </div>
    `;
    
    $('body').append(offCanvasHtml);
    
    // Show with animation
    setTimeout(() => {
      $('#settingsOffCanvas').addClass('ranjit-show');
    }, 10);
    
    // Tab switching
    $('.tab-btn').on('click', function() {
      const tabId = $(this).data('tab');
      $('.tab-btn').removeClass('ranjit-active');
      $('.ranjit-tab-content').removeClass('ranjit-active');
      $(this).addClass('ranjit-active');
      $(`#${tabId}-tab`).addClass('ranjit-active');
    });
    
    // Event handlers
    $('#closeSettings, .ranjit-offcanvas-overlay').on('click', function(e) {
      if (e.target === this) {
        $('#settingsOffCanvas').removeClass('ranjit-show');
        setTimeout(() => $('#settingsOffCanvas').remove(), 300);
      }
    });
    
    $('#applySettings').on('click', function() {
      applyEditorSettings();
      $('#settingsOffCanvas').removeClass('ranjit-show');
      setTimeout(() => $('#settingsOffCanvas').remove(), 300);
    });
    
    $('#resetSettings').on('click', function() {
      resetEditorSettings();
    });
  }
  
  // Clean HTML before saving - remove toolbars and handles
  function getCleanHTML(editorInstance) {
    const $temp = editorInstance.$contentArea.clone();
    
    // Remove all toolbars and interactive elements
    $temp.find('.image-toolbar, .video-overlay, .table-toolbar').remove();
    $temp.find('.image-resize-handles').remove();
    $temp.find('.image-figure, .video-figure, .table-figure').removeClass('selected editing');
    
    // Convert editor-specific elements to standard HTML
    $temp.find('.image-figure').each(function() {
      const $figure = $(this);
      const $img = $figure.find('img');
      const $caption = $figure.find('.image-caption');
      
      if ($img.length) {
        let imgHtml = $img[0].outerHTML;
        if ($caption.length && $caption.text().trim()) {
          imgHtml = `<figure>${imgHtml}<figcaption>${$caption.text()}</figcaption></figure>`;
        }
        $figure.replaceWith(imgHtml);
      }
    });
    
    $temp.find('.video-figure').each(function() {
      const $figure = $(this);
      const $video = $figure.find('iframe, video');
      const $caption = $figure.find('.video-caption');
      
      if ($video.length) {
        let videoHtml = $video[0].outerHTML;
        if ($caption.length && $caption.text().trim()) {
          videoHtml = `<figure>${videoHtml}<figcaption>${$caption.text()}</figcaption></figure>`;
        }
        $figure.replaceWith(videoHtml);
      }
    });
    
    $temp.find('.table-figure').each(function() {
      const $figure = $(this);
      const $table = $figure.find('table');
      
      if ($table.length) {
        $figure.replaceWith($table[0].outerHTML);
      }
    });
    
    // Remove editor-specific classes
    $temp.find('*').each(function() {
      const $el = $(this);
      $el.removeClass('ranjit-table hover-table sortable-table editable-table resizable-table');
      $el.removeClass('sortable-header sort-asc sort-desc');
      $el.removeClass('editor-image resizable-image gallery-image');
      $el.removeClass('video-embed');
    });
    
    return $temp.html();
  }
  
  // Video builder function
  function showVideoBuilder(editorInstance) {
    const videoBuilderHtml = `
      <div class="ranjit-modal-content video-builder-modal">
        <span class="ranjit-modal-close">&times;</span>
        <h3>🎥 Insert Video</h3>
        
        <div class="video-builder-section">
          <h4>🔗 Video URL</h4>
          <div class="video-url-inputs">
            <input type="url" id="videoUrlInput" placeholder="Paste YouTube, Vimeo, or direct video URL...">
            <button class="video-btn" id="loadVideoBtn">Load Video</button>
          </div>
          <div class="video-examples">
            <small>ℹ️ Supported: YouTube, Vimeo, MP4, WebM, OGV</small>
          </div>
        </div>
        
        <div class="video-builder-section">
          <h4>📁 Upload Video File</h4>
          <div class="video-upload-area" id="videoUploadArea">
            <div class="upload-content">
              <i class="fas fa-video"></i>
              <p>Click to Upload Video File</p>
              <small>Supports: MP4, WebM, OGV (Max 50MB)</small>
            </div>
            <input type="file" id="videoFileInput" accept="video/*,video/mp4,video/webm,video/ogg" style="display: none;">
          </div>
        </div>
        
        <div class="video-preview-section" id="videoPreviewSection" style="display: none;">
          <h4>🎨 Video Settings</h4>
          <div class="video-preview-container" id="videoPreviewContainer"></div>
          
          <div class="video-controls">
            <div class="control-group">
              <label>📏 Size:</label>
              <div class="size-buttons">
                <button class="size-btn" data-size="400">Small</button>
                <button class="size-btn active" data-size="560">Medium</button>
                <button class="size-btn" data-size="800">Large</button>
                <button class="size-btn" data-size="100%">Full Width</button>
              </div>
            </div>
            
            <div class="control-group">
              <label>📍 Alignment:</label>
              <div class="align-buttons">
                <button class="align-btn" data-align="left"><i class="fas fa-align-left"></i> Left</button>
                <button class="align-btn active" data-align="center"><i class="fas fa-align-center"></i> Center</button>
                <button class="align-btn" data-align="right"><i class="fas fa-align-right"></i> Right</button>
              </div>
            </div>
            
            <div class="control-group">
              <label>⚙️ Options:</label>
              <div class="video-options">
                <label><input type="checkbox" id="videoAutoplay"> ▶️ Autoplay</label>
                <label><input type="checkbox" id="videoControls" checked> 🎮 Show Controls</label>
                <label><input type="checkbox" id="videoLoop"> 🔁 Loop</label>
                <label><input type="checkbox" id="videoMuted"> 🔇 Muted</label>
              </div>
            </div>
            
            <div class="insert-buttons">
              <button class="video-btn ranjit-primary" id="insertVideoBtn">✨ Insert Video</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    $('#ranjitVideoModal').html(videoBuilderHtml).css('display', 'flex');
    
    let currentVideoData = null;
    
    // Video upload area click - direct binding
    $('#videoUploadArea').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Video upload area clicked'); // Debug log
      const fileInput = document.getElementById('videoFileInput');
      if (fileInput) {
        console.log('Triggering video file input click');
        fileInput.click();
      } else {
        console.log('Video file input not found');
      }
    });
    
    // File input change - direct binding
    $('#videoFileInput').on('change', function(e) {
      console.log('Video file input changed'); // Debug log
      const file = e.target.files[0];
      if (file) {
        handleVideoFile(file);
      }
      // Reset for repeated uploads
      $(this).val('');
    });
    
    // Load video URL
    $('#loadVideoBtn').on('click', function() {
      const url = $('#videoUrlInput').val().trim();
      if (url) {
        handleVideoUrl(url);
      }
    });
    
    // Size buttons
    $('.size-btn').on('click', function() {
      $('.size-btn').removeClass('active');
      $(this).addClass('active');
      updateVideoPreview();
    });
    
    // Alignment buttons
    $('.align-btn').on('click', function() {
      $('.align-btn').removeClass('active');
      $(this).addClass('active');
      updateVideoPreview();
    });
    
    // Video options
    $('.video-options input').on('change', function() {
      updateVideoPreview();
    });
    
    // Insert video
    $('#insertVideoBtn').on('click', function() {
      if (currentVideoData) {
        insertVideo(editorInstance, currentVideoData);
        $('#ranjitVideoModal').hide();
      } else {
        alert('Please select a video first!');
      }
    });
    
    function handleVideoFile(file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        alert('Video file should be less than 50MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = function(e) {
        showVideoPreview(e.target.result, 'file');
      };
      reader.readAsDataURL(file);
    }
    
    function handleVideoUrl(url) {
      // Detect video type
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = extractYouTubeId(url);
        if (videoId) {
          showVideoPreview(`https://www.youtube.com/embed/${videoId}`, 'youtube');
        } else {
          alert('Invalid YouTube URL');
        }
      } else if (url.includes('vimeo.com')) {
        const videoId = extractVimeoId(url);
        if (videoId) {
          showVideoPreview(`https://player.vimeo.com/video/${videoId}`, 'vimeo');
        } else {
          alert('Invalid Vimeo URL');
        }
      } else if (url.match(/\.(mp4|webm|ogv)$/i)) {
        showVideoPreview(url, 'direct');
      } else {
        alert('Unsupported video URL format');
      }
    }
    
    function extractYouTubeId(url) {
      const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      return match ? match[1] : null;
    }
    
    function extractVimeoId(url) {
      const match = url.match(/vimeo\.com\/(\d+)/);
      return match ? match[1] : null;
    }
    
    function showVideoPreview(src, type) {
      currentVideoData = { src, type };
      $('#videoPreviewSection').show();
      updateVideoPreview();
    }
    
    function updateVideoPreview() {
      if (!currentVideoData) return;
      
      const size = $('.size-btn.active').data('size') || '560';
      const align = $('.align-btn.active').data('align') || 'center';
      const autoplay = $('#videoAutoplay').is(':checked');
      const controls = $('#videoControls').is(':checked');
      const loop = $('#videoLoop').is(':checked');
      const muted = $('#videoMuted').is(':checked');
      
      let videoHtml = '';
      let containerStyle = '';
      
      if (align === 'center') {
        containerStyle = 'text-align: center; margin: 20px 0;';
      } else if (align === 'right') {
        containerStyle = 'text-align: right; margin: 20px 0;';
      } else {
        containerStyle = 'text-align: left; margin: 20px 0;';
      }
      
      if (currentVideoData.type === 'youtube' || currentVideoData.type === 'vimeo') {
        let embedSrc = currentVideoData.src;
        const params = [];
        
        if (autoplay) params.push('autoplay=1');
        if (!controls && currentVideoData.type === 'youtube') params.push('controls=0');
        if (loop && currentVideoData.type === 'youtube') params.push('loop=1');
        if (muted) params.push('muted=1');
        
        if (params.length > 0) {
          embedSrc += '?' + params.join('&');
        }
        
        const width = size === '100%' ? '100%' : size + 'px';
        const height = size === '100%' ? '400px' : Math.round(size * 0.5625) + 'px';
        
        videoHtml = `<iframe src="${embedSrc}" width="${width}" height="${height}" frameborder="0" allowfullscreen style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"></iframe>`;
      } else {
        const width = size === '100%' ? '100%' : size + 'px';
        const height = size === '100%' ? '400px' : Math.round(size * 0.5625) + 'px';
        
        let videoAttrs = `width="${width}" height="${height}" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"`;
        if (controls) videoAttrs += ' controls';
        if (autoplay) videoAttrs += ' autoplay';
        if (loop) videoAttrs += ' loop';
        if (muted) videoAttrs += ' muted';
        
        videoHtml = `<video ${videoAttrs}><source src="${currentVideoData.src}" type="video/mp4">Your browser does not support the video tag.</video>`;
      }
      
      $('#videoPreviewContainer').html(`<div style="${containerStyle}">${videoHtml}</div>`);
      
      currentVideoData.size = size;
      currentVideoData.align = align;
      currentVideoData.autoplay = autoplay;
      currentVideoData.controls = controls;
      currentVideoData.loop = loop;
      currentVideoData.muted = muted;
    }
  }
  
  function insertVideo(editorInstance, videoData) {
    const videoId = 'video-' + Math.random().toString(36).substr(2, 9);
    
    let videoElement = '';
    if (videoData.type === 'youtube' || videoData.type === 'vimeo') {
      let embedSrc = videoData.src;
      const params = [];
      
      if (videoData.autoplay) params.push('autoplay=1');
      if (!videoData.controls && videoData.type === 'youtube') params.push('controls=0');
      if (videoData.loop && videoData.type === 'youtube') params.push('loop=1');
      if (videoData.muted) params.push('muted=1');
      
      if (params.length > 0) {
        embedSrc += '?' + params.join('&');
      }
      
      const width = videoData.size === '100%' ? '100%' : videoData.size + 'px';
      const height = videoData.size === '100%' ? '400px' : Math.round(videoData.size * 0.5625) + 'px';
      
      videoElement = `<iframe src="${embedSrc}" width="${width}" height="${height}" frameborder="0" allowfullscreen class="video-embed"></iframe>`;
    } else {
      const width = videoData.size === '100%' ? '100%' : videoData.size + 'px';
      const height = videoData.size === '100%' ? '400px' : Math.round(videoData.size * 0.5625) + 'px';
      
      let videoAttrs = `width="${width}" height="${height}" class="video-embed"`;
      if (videoData.controls) videoAttrs += ' controls';
      if (videoData.autoplay) videoAttrs += ' autoplay';
      if (videoData.loop) videoAttrs += ' loop';
      if (videoData.muted) videoAttrs += ' muted';
      
      videoElement = `<video ${videoAttrs}><source src="${videoData.src}" type="video/mp4">Your browser does not support the video tag.</video>`;
    }
    
    const videoHtml = `
      <figure class="video-figure ${videoData.align}" data-video-id="${videoId}">
        <div class="video-container">
          ${videoElement}
          <div class="video-overlay" style="display: none;">
            <div class="video-toolbar">
              <button class="vid-btn" data-action="replace" title="Replace Video"><i class="fas fa-video"></i></button>
              <button class="vid-btn" data-action="align-left" title="Align Left"><i class="fas fa-align-left"></i></button>
              <button class="vid-btn" data-action="align-center" title="Align Center"><i class="fas fa-align-center"></i></button>
              <button class="vid-btn" data-action="align-right" title="Align Right"><i class="fas fa-align-right"></i></button>
              <button class="vid-btn" data-action="resize-small" title="Small (400px)"><i class="fas fa-compress"></i></button>
              <button class="vid-btn" data-action="resize-medium" title="Medium (560px)"><i class="fas fa-expand-arrows-alt"></i></button>
              <button class="vid-btn" data-action="resize-large" title="Large (800px)"><i class="fas fa-expand"></i></button>
              <button class="vid-btn" data-action="add-caption" title="Add Caption"><i class="fas fa-comment"></i></button>
              <button class="vid-btn" data-action="copy-video" title="Copy Video"><i class="fas fa-copy"></i></button>
              <button class="vid-btn danger" data-action="delete" title="Delete Video"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        </div>
        ${videoData.caption ? `<figcaption class="video-caption" contenteditable="true">${videoData.caption}</figcaption>` : ''}
      </figure>
      <p><br></p>
    `;
    
    editorInstance.$contentArea.focus();
    editorInstance.exec('insertHTML', videoHtml);
    
    // Initialize video interactions
    setTimeout(() => initializeVideoInteractions(videoId), 100);
  }
  
  // Image builder function
  function showImageBuilder(editorInstance) {
    const imageBuilderHtml = `
      <div class="ranjit-modal-content image-builder-modal">
        <span class="ranjit-modal-close">&times;</span>
        <h3>🖼️ Insert Image</h3>
        
        <div class="image-builder-section">
          <h4>📁 Upload Images</h4>
          <div class="upload-options">
            <button class="upload-mode-btn active" data-mode="single">📷 Single Image</button>
            <button class="upload-mode-btn" data-mode="multiple">🖼️ Multiple Images</button>
          </div>
          <div class="upload-area" id="imageUploadArea">
            <div class="upload-content">
              <i class="fas fa-cloud-upload-alt"></i>
              <p id="uploadText">Drag & Drop or Click to Upload</p>
              <small id="uploadHint">Supports: JPG, PNG, GIF (Max 2MB each)</small>
            </div>
            <input type="file" id="imageFileInput" accept="image/*,image/jpeg,image/png,image/gif" style="display: none;">
          </div>
        </div>
        
        <div class="image-builder-section">
          <h4>🔗 Image URL</h4>
          <div class="url-input-group">
            <input type="url" id="imageUrlInput" placeholder="https://example.com/image.jpg">
            <button class="image-btn" id="loadImageUrl">Load</button>
          </div>
        </div>
        
        <div class="gallery-preview-section" id="galleryPreviewSection" style="display: none;">
          <h4>🖼️ Gallery Preview</h4>
          <div class="gallery-images-container" id="galleryImagesContainer"></div>
          <div class="gallery-controls">
            <button class="image-btn" id="addMoreImages">➕ Add More Images</button>
            <button class="image-btn" id="clearGallery">🗑️ Clear All</button>
            <button class="image-btn ranjit-primary" id="insertGalleryBtn">✨ Insert Gallery</button>
          </div>
        </div>
        
        <div class="image-preview-section" id="imagePreviewSection" style="display: none;">
          <h4>🎨 Image Settings</h4>
          <div class="image-preview-container">
            <img id="imagePreview" src="" alt="Preview">
          </div>
          
          <div class="image-controls">
            <div class="control-group">
              <label>📏 Size:</label>
              <div class="size-buttons">
                <button class="size-btn active" data-size="25">25%</button>
                <button class="size-btn" data-size="50">50%</button>
                <button class="size-btn" data-size="75">75%</button>
                <button class="size-btn" data-size="100">100%</button>
                <input type="number" id="customSize" placeholder="Custom" min="10" max="200" style="width: 80px;">
              </div>
            </div>
            
            <div class="control-group">
              <label>📍 Alignment:</label>
              <div class="align-buttons">
                <button class="align-btn active" data-align="left"><i class="fas fa-align-left"></i> Left</button>
                <button class="align-btn" data-align="center"><i class="fas fa-align-center"></i> Center</button>
                <button class="align-btn" data-align="right"><i class="fas fa-align-right"></i> Right</button>
              </div>
            </div>
            
            <div class="control-group">
              <label>🎯 Display:</label>
              <div class="display-buttons">
                <button class="display-btn active" data-display="inline">📄 Inline</button>
                <button class="display-btn" data-display="block">📋 Block</button>
                <button class="display-btn" data-display="gallery">🖼️ Gallery</button>
              </div>
            </div>
            
            <div class="control-group">
              <label>✏️ Alt Text:</label>
              <input type="text" id="imageAltText" placeholder="Describe the image...">
            </div>
            
            <div class="insert-buttons">
              <button class="image-btn ranjit-primary" id="insertImageBtn">✨ Insert Image</button>
              <button class="image-btn" id="addToGalleryBtn">📚 Add to Gallery</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    $('#ranjitImageModal').html(imageBuilderHtml).css('display', 'flex');
    
    let currentImageData = null;
    let galleryImages = [];
    window.currentUploadMode = 'single';
    let uploadMode = 'single';
    
    // Upload mode toggle
    $('.upload-mode-btn').on('click', function() {
      $('.upload-mode-btn').removeClass('active');
      $(this).addClass('active');
      uploadMode = $(this).data('mode');
      window.currentUploadMode = uploadMode;
      
      if (uploadMode === 'multiple') {
        $('#imageFileInput').attr('multiple', true);
        $('#uploadText').text('Select Multiple Images for Gallery');
        $('#uploadHint').text('Hold Ctrl/Cmd to select multiple files (Max 2MB each)');
      } else {
        $('#imageFileInput').removeAttr('multiple');
        $('#uploadText').text('Drag & Drop or Click to Upload');
        $('#uploadHint').text('Supports: JPG, PNG, GIF (Max 2MB)');
      }
    });
    
    // Upload area click - fix for proper file input triggering
    $('#imageUploadArea').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Upload area clicked, mode:', uploadMode); // Debug log
      const fileInput = document.getElementById('imageFileInput');
      if (fileInput) {
        // Set multiple attribute based on current mode
        if (window.currentUploadMode === 'multiple') {
          fileInput.setAttribute('multiple', true);
        } else {
          fileInput.removeAttribute('multiple');
        }
        console.log('Triggering file input click');
        fileInput.click();
      } else {
        console.log('File input not found');
      }
    });
    
    // File input change
    $(document).on('change', '#imageFileInput', function(e) {
      console.log('File input changed'); // Debug log
      const files = e.target.files;
      if (!files || files.length === 0) return;
      
      if (uploadMode === 'multiple' && files.length > 1) {
        handleMultipleFiles(files);
      } else if (files[0]) {
        handleImageFile(files[0]);
      }
      
      // Reset file input for repeated uploads
      $(this).val('');
    });
    
    // Drag and drop
    $('#imageUploadArea').on('dragover', function(e) {
      e.preventDefault();
      $(this).addClass('drag-over');
    }).on('dragleave', function() {
      $(this).removeClass('drag-over');
    }).on('drop', function(e) {
      e.preventDefault();
      $(this).removeClass('drag-over');
      const files = e.originalEvent.dataTransfer.files;
      
      if (uploadMode === 'multiple' && files.length > 1) {
        handleMultipleFiles(files);
      } else if (files[0] && files[0].type.startsWith('image/')) {
        handleImageFile(files[0]);
      }
    });
    
    // URL input
    $('#loadImageUrl').on('click', function() {
      const url = $('#imageUrlInput').val().trim();
      if (url) {
        handleImageUrl(url);
      }
    });
    
    // Size buttons
    $('.size-btn').on('click', function() {
      $('.size-btn').removeClass('active');
      $(this).addClass('active');
      updateImagePreview();
    });
    
    // Custom size input
    $('#customSize').on('input', function() {
      $('.size-btn').removeClass('active');
      updateImagePreview();
    });
    
    // Alignment buttons
    $('.align-btn').on('click', function() {
      $('.align-btn').removeClass('active');
      $(this).addClass('active');
      updateImagePreview();
    });
    
    // Display buttons
    $('.display-btn').on('click', function() {
      $('.display-btn').removeClass('active');
      $(this).addClass('active');
      updateImagePreview();
    });
    
    // Insert image
    $('#insertImageBtn').on('click', function() {
      const imageData = currentImageData || window.currentImageData;
      if (imageData) {
        insertImage(editorInstance, imageData);
        $('#ranjitImageModal').hide();
        // Clear data
        currentImageData = null;
        window.currentImageData = null;
      } else {
        alert('Please select an image first!');
      }
    });
    
    // Add to gallery
    $('#addToGalleryBtn').on('click', function() {
      const imageData = currentImageData || window.currentImageData;
      if (imageData) {
        galleryImages.push({...imageData});
        updateGalleryPreview();
        // Clear current image data for next image
        currentImageData = null;
        window.currentImageData = null;
        $('#imagePreviewSection').hide();
        alert(`Image added to gallery! Total: ${galleryImages.length} images`);
      }
    });
    
    // Gallery controls
    $(document).on('click', '#addMoreImages', function(e) {
      e.preventDefault();
      const fileInput = document.getElementById('imageFileInput');
      if (fileInput) {
        fileInput.click();
      }
    });
    
    $('#clearGallery').on('click', function() {
      if (confirm('Clear all gallery images?')) {
        galleryImages = [];
        $('#galleryPreviewSection').hide();
      }
    });
    
    $('#insertGalleryBtn').on('click', function() {
      if (galleryImages.length >= 2) {
        insertGallery(editorInstance, galleryImages);
        $('#ranjitImageModal').hide();
        galleryImages = [];
      } else {
        alert('Gallery needs at least 2 images!');
      }
    });
    
    function handleImageFile(file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          // Compress if needed
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          let { width, height } = img;
          const maxSize = 1200;
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height * maxSize) / width;
              width = maxSize;
            } else {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          showImagePreview(compressedDataUrl, width, height);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
    
    function handleImageUrl(url) {
      const img = new Image();
      img.onload = function() {
        showImagePreview(url, img.width, img.height);
      };
      img.onerror = function() {
        alert('Failed to load image from URL');
      };
      img.src = url;
    }
    
    function handleMultipleFiles(files) {
      const validFiles = Array.from(files).filter(file => 
        file.type.startsWith('image/') && file.size <= 2 * 1024 * 1024
      );
      
      if (validFiles.length === 0) {
        alert('No valid images found. Please select image files under 2MB.');
        return;
      }
      
      let processed = 0;
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
          const img = new Image();
          img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            let { width, height } = img;
            const maxSize = 800; // Smaller for gallery
            if (width > maxSize || height > maxSize) {
              if (width > height) {
                height = (height * maxSize) / width;
                width = maxSize;
              } else {
                width = (width * maxSize) / height;
                height = maxSize;
              }
            }
            
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
            galleryImages.push({
              src: compressedDataUrl,
              width,
              height,
              size: 25, // Default gallery size
              align: 'left',
              display: 'gallery',
              alt: `Gallery Image ${galleryImages.length + 1}`
            });
            
            processed++;
            if (processed === validFiles.length) {
              updateGalleryPreview();
            }
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      });
    }
    
    function updateGalleryPreview() {
      if (galleryImages.length === 0) {
        $('#galleryPreviewSection').hide();
        return;
      }
      
      let galleryHtml = '';
      galleryImages.forEach((img, index) => {
        galleryHtml += `
          <div class="gallery-preview-item">
            <img src="${img.src}" alt="${img.alt}">
            <button class="remove-gallery-item" data-index="${index}">×</button>
          </div>
        `;
      });
      
      $('#galleryImagesContainer').html(galleryHtml);
      $('#galleryPreviewSection').show();
      $('#imagePreviewSection').hide();
      
      // Remove item functionality
      $('.remove-gallery-item').on('click', function() {
        const index = $(this).data('index');
        galleryImages.splice(index, 1);
        updateGalleryPreview();
      });
    }
    
    function showImagePreview(src, width, height) {
      currentImageData = { src, width, height, size: 50, align: 'left', display: 'inline', alt: 'Image' };
      window.currentImageData = currentImageData;
      $('#imagePreview').attr('src', src);
      $('#imagePreviewSection').show();
      $('#galleryPreviewSection').hide();
      updateImagePreview();
    }
    
    function updateImagePreview() {
      if (!currentImageData && !window.currentImageData) return;
      
      const imageData = currentImageData || window.currentImageData;
      const size = $('#customSize').val() || $('.size-btn.active').data('size') || 50;
      const align = $('.align-btn.active').data('align') || 'left';
      const display = $('.display-btn.active').data('display') || 'inline';
      
      let style = `width: ${size}%; height: auto;`;
      
      if (display === 'block') {
        style += ` display: block; margin: 10px auto;`;
      } else if (display === 'gallery') {
        style += ` display: inline-block; margin: 5px;`;
      }
      
      if (align === 'center') {
        style += ` margin-left: auto; margin-right: auto; display: block;`;
      } else if (align === 'right') {
        style += ` float: right; margin-left: 10px;`;
      } else if (align === 'left') {
        style += ` float: left; margin-right: 10px;`;
      }
      
      $('#imagePreview').attr('style', style);
      
      imageData.size = size;
      imageData.align = align;
      imageData.display = display;
      imageData.alt = $('#imageAltText').val() || 'Image';
      
      // Update both references
      currentImageData = imageData;
      window.currentImageData = imageData;
    }
  }
  
  function insertImage(editorInstance, imageData) {
    const imgId = 'img-' + Math.random().toString(36).substr(2, 9);
    
    // Create advanced image with resize handles and toolbar
    const imgHtml = `
      <figure class="image-figure ${imageData.align} ${imageData.display || 'wrap-text'}" data-image-id="${imgId}">
        <div class="image-container">
          <img id="${imgId}" 
               src="${imageData.src}" 
               alt="${imageData.alt || 'Image'}" 
               class="editor-image resizable-image" 
               data-type="image"
               style="height: auto;">
          <div class="image-resize-handles" style="display: none;">
            <div class="resize-handle nw" data-direction="nw"></div>
            <div class="resize-handle ne" data-direction="ne"></div>
            <div class="resize-handle sw" data-direction="sw"></div>
            <div class="resize-handle se" data-direction="se"></div>
            <div class="resize-handle n" data-direction="n"></div>
            <div class="resize-handle s" data-direction="s"></div>
            <div class="resize-handle w" data-direction="w"></div>
            <div class="resize-handle e" data-direction="e"></div>
          </div>
          <div class="image-toolbar" style="display: none;">
            <button class="img-btn" data-action="resize-small" title="Small (25%)"><i class="fas fa-compress"></i></button>
            <button class="img-btn" data-action="resize-medium" title="Medium (50%)"><i class="fas fa-expand-arrows-alt"></i></button>
            <button class="img-btn" data-action="resize-large" title="Large (75%)"><i class="fas fa-expand"></i></button>
            <button class="img-btn" data-action="resize-full" title="Full Width (100%)"><i class="fas fa-arrows-alt-h"></i></button>
            <button class="img-btn" data-action="wrap-left" title="Align Left"><i class="fas fa-align-left"></i></button>
            <button class="img-btn" data-action="break-center" title="Center"><i class="fas fa-align-center"></i></button>
            <button class="img-btn" data-action="wrap-right" title="Align Right"><i class="fas fa-align-right"></i></button>
            <button class="img-btn danger" data-action="delete" title="Delete"><i class="fas fa-trash"></i></button>
          </div>
        </div>
        ${imageData.caption ? `<figcaption class="image-caption" contenteditable="true">${imageData.caption}</figcaption>` : ''}
      </figure>
      <p><br></p>
    `;
    
    // Focus editor and insert
    editorInstance.$contentArea.focus();
    editorInstance.exec('insertHTML', imgHtml);
    
    // Initialize image interactions
    setTimeout(() => initializeImageInteractions(imgId), 100);
  }
  
  function insertGallery(editorInstance, images) {
    let galleryHtml = '<div class="image-gallery" style="display: flex; flex-wrap: wrap; gap: 10px; margin: 20px 0;">';
    
    images.forEach(img => {
      const size = Math.min(100 / images.length, 25); // Auto-size based on count
      galleryHtml += `<img src="${img.src}" alt="${img.alt}" style="width: ${size}%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" class="gallery-image">`;
    });
    
    galleryHtml += '</div><p><br></p>';
    editorInstance.exec('insertHTML', galleryHtml);
  }
  
  // Table builder function
  function showTableBuilder(editorInstance) {
    const tableBuilderHtml = `
      <div class="ranjit-modal-content table-builder-modal">
        <span class="ranjit-modal-close">&times;</span>
        <h3>📊 Advanced Table Builder</h3>
        

        
        <div class="table-builder-section">
          <h4>⚙️ Table Configuration</h4>
          <div class="table-config-grid">
            <div class="config-group">
              <label>📏 Table Size</label>
              <div class="dimension-inputs">
                <input type="number" id="customRows" value="3" min="1" max="20" placeholder="Rows">
                <span>×</span>
                <input type="number" id="customCols" value="3" min="1" max="15" placeholder="Cols">
              </div>
            </div>
            <div class="config-group">
              <label>📐 Table Width</label>
              <select id="tableWidth" class="ranjit-select">
                <option value="100">🔲 Full Width (100%)</option>
                <option value="75">📏 Large (75%)</option>
                <option value="50">📐 Medium (50%)</option>
                <option value="auto">📦 Auto Fit</option>
              </select>
            </div>
            <div class="config-group">
              <label>🎨 Color Theme</label>
              <select id="tableColorTheme" class="ranjit-select">
                <option value="blue">🌊 Blue Ocean</option>
                <option value="green">🌲 Forest Green</option>
                <option value="purple">👑 Royal Purple</option>
                <option value="red">🔥 Crimson Red</option>
                <option value="orange">🌅 Sunset Orange</option>
                <option value="dark">🌙 Dark Mode</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="table-builder-section">
          <h4>🎨 Table Styles</h4>
          <div class="table-templates">
            <button class="template-btn" data-template="simple">
              <div class="template-preview">
                <div class="mini-table simple"></div>
              </div>
              <span>Simple</span>
            </button>
            <button class="template-btn" data-template="header">
              <div class="template-preview">
                <div class="mini-table header"></div>
              </div>
              <span>Header</span>
            </button>
            <button class="template-btn" data-template="striped">
              <div class="template-preview">
                <div class="mini-table striped"></div>
              </div>
              <span>Striped</span>
            </button>
            <button class="template-btn" data-template="bordered">
              <div class="template-preview">
                <div class="mini-table bordered"></div>
              </div>
              <span>Bordered</span>
            </button>
            <button class="template-btn" data-template="modern">
              <div class="template-preview">
                <div class="mini-table modern"></div>
              </div>
              <span>Modern</span>
            </button>
            <button class="template-btn" data-template="minimal">
              <div class="template-preview">
                <div class="mini-table minimal"></div>
              </div>
              <span>Minimal</span>
            </button>
          </div>
        </div>
        
        <div class="table-builder-section">
          <h4>🔧 Advanced Features</h4>
          <div class="feature-toggles">
            <label class="feature-toggle">
              <input type="checkbox" id="tableResponsive" checked>
              <span class="toggle-slider"></span>
              <div class="toggle-content">
                <strong>📱 Responsive</strong>
                <small>Auto-scroll on mobile devices</small>
              </div>
            </label>
            <label class="feature-toggle">
              <input type="checkbox" id="tableHover">
              <span class="toggle-slider"></span>
              <div class="toggle-content">
                <strong>🖱️ Hover Effects</strong>
                <small>Highlight rows on hover</small>
              </div>
            </label>
            <label class="feature-toggle">
              <input type="checkbox" id="tableSortable">
              <span class="toggle-slider"></span>
              <div class="toggle-content">
                <strong>🔄 Sortable</strong>
                <small>Click headers to sort data</small>
              </div>
            </label>
            <label class="feature-toggle">
              <input type="checkbox" id="tableEditable">
              <span class="toggle-slider"></span>
              <div class="toggle-content">
                <strong>✏️ Editable</strong>
                <small>Click cells to edit content</small>
              </div>
            </label>
            <label class="feature-toggle">
              <input type="checkbox" id="tableResizable">
              <span class="toggle-slider"></span>
              <div class="toggle-content">
                <strong>↔️ Resizable</strong>
                <small>Drag column borders to resize</small>
              </div>
            </label>
          </div>
        </div>
        
        <div class="table-builder-section">
          <h4>📋 Quick Templates</h4>
          <div class="quick-templates">
            <button class="quick-template-btn" data-preset="data-table">
              📊 Data Table
              <small>5×4 with headers & sorting</small>
            </button>
            <button class="quick-template-btn" data-preset="comparison">
              ⚖️ Comparison
              <small>3×3 feature comparison</small>
            </button>
            <button class="quick-template-btn" data-preset="pricing">
              💰 Pricing
              <small>4×3 pricing table</small>
            </button>
            <button class="quick-template-btn" data-preset="schedule">
              📅 Schedule
              <small>7×5 weekly schedule</small>
            </button>
          </div>
        </div>
        
        <div class="table-actions">
          <button class="table-btn ranjit-secondary" id="previewTableBtn">👁️ Preview</button>
          <button class="table-btn ranjit-primary" id="createTableBtn">✨ Create Table</button>
        </div>
      </div>
    `;
    
    $('#ranjitTableModal').html(tableBuilderHtml).css('display', 'flex');
    
    let selectedTemplate = 'simple';
    
    // Grid selector functionality
    const maxRows = 10, maxCols = 10;
    let gridHtml = '';
    for (let r = 0; r < maxRows; r++) {
      for (let c = 0; c < maxCols; c++) {
        gridHtml += `<div class="grid-cell" data-row="${r+1}" data-col="${c+1}"></div>`;
      }
    }
    $('#tableGridSelector .grid-preview').html(gridHtml);
    
    // Grid hover effects
    $('#ranjitTableModal').off('mouseenter', '.grid-cell').on('mouseenter', '.grid-cell', function() {
      const row = $(this).data('row');
      const col = $(this).data('col');
      
      $('.grid-cell').removeClass('active');
      for (let r = 1; r <= row; r++) {
        for (let c = 1; c <= col; c++) {
          $(`.grid-cell[data-row="${r}"][data-col="${c}"]`).addClass('active');
        }
      }
      $('#gridInfo').text(`${row} × ${col} table`);
    });
    

    
    // Custom table creation
    $(document).on('click', '#createCustomTable', function() {
      const rows = parseInt($('#customRows').val());
      const cols = parseInt($('#customCols').val());
      if (rows > 0 && cols > 0) {
        const options = {
          responsive: $('#tableResponsive').is(':checked'),
          hover: $('#tableHover').is(':checked'),
          sortable: $('#tableSortable').is(':checked'),
          colorTheme: $('#tableColorTheme').val(),
          width: $('#tableWidth').val()
        };
        createAdvancedTable(editorInstance, rows, cols, 'simple', options);
        $('#ranjitTableModal').hide();
      }
    });
    
    // Template selection
    $('.template-btn').on('click', function() {
      $('.template-btn').removeClass('active');
      $(this).addClass('active');
      selectedTemplate = $(this).data('template');
    });
    
    // Quick template presets
    $(document).off('click', '#ranjitTableModal .quick-template-btn').on('click', '#ranjitTableModal .quick-template-btn', function() {
      const preset = $(this).data('preset');
      applyPreset(preset);
      
      // Auto create table with preset
      const rows = parseInt($('#customRows').val()) || 3;
      const cols = parseInt($('#customCols').val()) || 3;
      const options = getTableOptions();
      
      if (activeEditorInstance) {
        createAdvancedTable(activeEditorInstance, rows, cols, selectedTemplate, options);
        $('#ranjitTableModal').hide();
      }
    });
    
    // Create table
    $('#createTableBtn').on('click', function() {
      const rows = parseInt($('#customRows').val()) || 3;
      const cols = parseInt($('#customCols').val()) || 3;
      const options = getTableOptions();
      
      if (rows > 0 && cols > 0 && activeEditorInstance) {
        createAdvancedTable(activeEditorInstance, rows, cols, selectedTemplate, options);
        $('#ranjitTableModal').hide();
      } else {
        alert('Please enter valid table dimensions');
      }
    });
    
    function getTableOptions() {
      return {
        responsive: $('#tableResponsive').is(':checked'),
        hover: $('#tableHover').is(':checked'),
        sortable: $('#tableSortable').is(':checked'),
        editable: $('#tableEditable').is(':checked'),
        resizable: $('#tableResizable').is(':checked'),
        colorTheme: $('#tableColorTheme').val(),
        width: $('#tableWidth').val()
      };
    }
    
    function applyPreset(preset) {
      const presets = {
        'data-table': { rows: 5, cols: 4, template: 'header', sortable: true, hover: true },
        'comparison': { rows: 4, cols: 3, template: 'bordered', hover: true },
        'pricing': { rows: 4, cols: 3, template: 'modern', hover: true },
        'schedule': { rows: 8, cols: 5, template: 'striped', hover: true }
      };
      
      const config = presets[preset];
      if (config) {
        $('#customRows').val(config.rows);
        $('#customCols').val(config.cols);
        selectedTemplate = config.template;
        $('.template-btn').removeClass('active');
        $(`.template-btn[data-template="${config.template}"]`).addClass('active');
        
        if (config.sortable) $('#tableSortable').prop('checked', true);
        if (config.hover) $('#tableHover').prop('checked', true);
      }
    }
    
    $('.template-btn').first().addClass('active');
  }
  
  // Create advanced table with modern features
  function createAdvancedTable(editorInstance, rows, cols, template, options = {}) {
    const colorThemes = {
      blue: { primary: '#667eea', secondary: '#764ba2', light: '#f0f4ff' },
      green: { primary: '#28a745', secondary: '#20c997', light: '#f0fff4' },
      purple: { primary: '#6f42c1', secondary: '#e83e8c', light: '#f8f0ff' },
      red: { primary: '#dc3545', secondary: '#fd7e14', light: '#fff5f5' },
      orange: { primary: '#fd7e14', secondary: '#ffc107', light: '#fff8f0' },
      dark: { primary: '#2d3748', secondary: '#4a5568', light: '#1a202c' }
    };
    
    const theme = colorThemes[options.colorTheme] || colorThemes.blue;
    const tableId = 'table-' + Math.random().toString(36).substr(2, 9);
    
    let tableClasses = 'ranjit-table';
    if (options.responsive) tableClasses += ' responsive-table';
    if (options.hover) tableClasses += ' hover-table';
    if (options.sortable) tableClasses += ' sortable-table';
    if (options.editable) tableClasses += ' editable-table';
    if (options.resizable) tableClasses += ' resizable-table';
    
    let tableStyle = `border-collapse: collapse;margin: 20px 0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);`;
    
    let table = `<table id="${tableId}" class="${tableClasses}" style="${tableStyle}">`;
    
    // Add thead for header templates
    if (template === 'header' || template === 'modern' || options.sortable) {
      table += '<thead>';
    } else {
      table += '<tbody>';
    }
    
    const hasHeader = (template === 'header' || template === 'modern' || options.sortable);
    
    for (let r = 0; r < rows; r++) {
      table += '<tr>';
      
      for (let c = 0; c < cols; c++) {
        let cellStyle = 'padding: 15px 12px; border: 1px solid #e1e8ed; text-align: left; transition: all 0.3s ease;';
        let cellContent = '&nbsp;';
        
        // Header row styling
        if (hasHeader && r === 0) {
          cellStyle += ` background: linear-gradient(135deg, ${theme.primary}, ${theme.secondary}); color: white; font-weight: 600; font-size: 14px;`;
          if (options.sortable) {
            cellContent = `<span class="sortable-header">Header ${c + 1} <i class="fas fa-sort"></i></span>`;
          } else {
            cellContent = `Header ${c + 1}`;
          }
          table += `<th style="${cellStyle}">${cellContent}</th>`;
        } else {
          // Body cell styling based on template
          const bodyRowIndex = hasHeader ? r - 1 : r; // Adjust for header row
          
          switch(template) {
            case 'striped':
              if (bodyRowIndex % 2 === 1) cellStyle += ` background: ${theme.light};`;
              break;
            case 'bordered':
              cellStyle += ` border: 2px solid ${theme.primary};`;
              break;
            case 'modern':
              cellStyle += ` background: #fafbfc;`;
              if (bodyRowIndex % 2 === 0) cellStyle += ` background: ${theme.light};`;
              break;
            case 'minimal':
              cellStyle += ' border: none; border-bottom: 1px solid #e1e8ed;';
              break;
          }
          
          if (options.hover) {
            cellStyle += ` cursor: pointer;`;
          }
          
          table += `<td style="${cellStyle}">${cellContent}</td>`;
        }
      }
      
      table += '</tr>';
      
      // Close thead and start tbody after header row
      if (hasHeader && r === 0) {
        table += '</thead><tbody>';
      }
    }
    
    table += '</tbody></table>';
    
    // Wrap table with container for toolbar
    const tableContainer = `
      <div class="table-figure" data-table-id="${tableId}">
        <div class="table-container">
          ${options.responsive ? `<div class="table-responsive" style="overflow-x: auto;">${table}</div>` : table}
          <div class="table-toolbar" style="display: none;">
            <button class="tbl-btn" data-action="add-row-above" title="Add Row Above"><i class="fas fa-plus"></i><i class="fas fa-minus"></i></button>
            <button class="tbl-btn" data-action="add-row-below" title="Add Row Below"><i class="fas fa-plus"></i><i class="fas fa-equals"></i></button>
            <button class="tbl-btn" data-action="add-col-left" title="Add Column Left"><i class="fas fa-plus"></i><i class="fas fa-grip-lines-vertical"></i></button>
            <button class="tbl-btn" data-action="add-col-right" title="Add Column Right"><i class="fas fa-grip-lines-vertical"></i><i class="fas fa-plus"></i></button>
            <button class="tbl-btn" data-action="delete-row" title="Delete Row"><i class="fas fa-trash"></i><i class="fas fa-minus"></i></button>
            <button class="tbl-btn" data-action="delete-col" title="Delete Column"><i class="fas fa-trash"></i><i class="fas fa-grip-lines-vertical"></i></button>
            <button class="tbl-btn" data-action="table-props" title="Table Properties"><i class="fas fa-cog"></i></button>
            <button class="tbl-btn danger" data-action="delete-table" title="Delete Table"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>
      <p><br></p>
    `;
    
    editorInstance.exec('insertHTML', tableContainer);
    
    // Add advanced functionality if enabled
    setTimeout(() => {
      if (options.sortable) addTableSortability(tableId);
      if (options.editable) addTableEditability(tableId);
      if (options.resizable) addTableResizability(tableId);
      addTableContextMenu(tableId, options);
      initializeTableInteractions(tableId);
    }, 100);
  }
  
  // Add table sorting functionality
  function addTableSortability(tableId) {
    $(document).on('click', `#${tableId} .sortable-header`, function() {
      const $table = $(this).closest('table');
      const columnIndex = $(this).closest('th').index();
      const $tbody = $table.find('tbody');
      const rows = $tbody.find('tr').toArray();
      
      // Toggle sort direction
      const isAsc = $(this).hasClass('sort-asc');
      $table.find('.sortable-header').removeClass('sort-asc sort-desc');
      $table.find('.sortable-header i').removeClass('fa-sort-up fa-sort-down').addClass('fa-sort');
      
      if (isAsc) {
        $(this).addClass('sort-desc');
        $(this).find('i').removeClass('fa-sort').addClass('fa-sort-down');
      } else {
        $(this).addClass('sort-asc');
        $(this).find('i').removeClass('fa-sort').addClass('fa-sort-up');
      }
      
      // Sort rows
      rows.sort((a, b) => {
        const aText = $(a).find('td').eq(columnIndex).text().trim();
        const bText = $(b).find('td').eq(columnIndex).text().trim();
        
        // Try numeric sort first
        const aNum = parseFloat(aText.replace(/[^\d.-]/g, ''));
        const bNum = parseFloat(bText.replace(/[^\d.-]/g, ''));
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return isAsc ? bNum - aNum : aNum - bNum;
        }
        
        // Fallback to text sort
        if (isAsc) {
          return bText.localeCompare(aText);
        } else {
          return aText.localeCompare(bText);
        }
      });
      
      // Reorder rows with animation
      $tbody.fadeOut(200, function() {
        $tbody.empty().append(rows).fadeIn(200);
      });
    });
  }
  
  // Add table editability
  function addTableEditability(tableId) {
    $(document).on('dblclick', `#${tableId} td`, function() {
      const $cell = $(this);
      if ($cell.hasClass('editing')) return;
      
      const originalText = $cell.text();
      const $input = $('<input type="text" class="cell-editor">');
      $input.val(originalText);
      
      $cell.addClass('editing').html($input);
      $input.focus().select();
      
      function finishEdit() {
        const newText = $input.val();
        $cell.removeClass('editing').text(newText);
        if (newText !== originalText) {
          $cell.addClass('cell-modified');
          setTimeout(() => $cell.removeClass('cell-modified'), 2000);
        }
      }
      
      $input.on('blur keydown', function(e) {
        if (e.type === 'blur' || e.key === 'Enter') {
          finishEdit();
        } else if (e.key === 'Escape') {
          $cell.removeClass('editing').text(originalText);
        }
      });
    });
  }
  
  // Add table column resizability
  function addTableResizability(tableId) {
    const $table = $(`#${tableId}`);
    const $headers = $table.find('th');
    
    $headers.each(function(index) {
      const $header = $(this);
      const $resizer = $('<div class="column-resizer"></div>');
      $header.append($resizer);
      
      let isResizing = false;
      let startX, startWidth;
      
      $resizer.on('mousedown', function(e) {
        isResizing = true;
        startX = e.pageX;
        startWidth = $header.outerWidth();
        
        $(document).on('mousemove.resize', function(e) {
          if (!isResizing) return;
          const width = startWidth + e.pageX - startX;
          $header.css('width', Math.max(50, width) + 'px');
        });
        
        $(document).on('mouseup.resize', function() {
          isResizing = false;
          $(document).off('mousemove.resize mouseup.resize');
        });
        
        e.preventDefault();
      });
    });
  }
  
  // Add table context menu
  function addTableContextMenu(tableId, options) {
    const $table = $(`#${tableId}`);
    
    $(document).on('contextmenu', `#${tableId} td, #${tableId} th`, function(e) {
      e.preventDefault();
      const $cell = $(this);
      const isHeader = $cell.is('th');
      const rowIndex = $cell.parent().index();
      const colIndex = $cell.index();
      
      showTableContextMenu(e.pageX, e.pageY, $table, $cell, rowIndex, colIndex, isHeader);
    });
  }
  
  function showTableContextMenu(x, y, $table, $cell, rowIndex, colIndex, isHeader) {
    $('.table-context-menu').remove();
    
    const menuHtml = `
      <div class="table-context-menu" style="position: fixed; top: ${y}px; left: ${x}px; z-index: 10000;">
        <div class="context-menu-content">
          <button class="context-item" data-action="insert-row-above"><i class="fas fa-plus"></i> Insert Row Above</button>
          <button class="context-item" data-action="insert-row-below"><i class="fas fa-plus"></i> Insert Row Below</button>
          <button class="context-item" data-action="insert-col-left"><i class="fas fa-plus"></i> Insert Column Left</button>
          <button class="context-item" data-action="insert-col-right"><i class="fas fa-plus"></i> Insert Column Right</button>
          <div class="context-divider"></div>
          <button class="context-item" data-action="delete-row"><i class="fas fa-trash"></i> Delete Row</button>
          <button class="context-item" data-action="delete-col"><i class="fas fa-trash"></i> Delete Column</button>
          <div class="context-divider"></div>
          <button class="context-item" data-action="merge-cells"><i class="fas fa-object-group"></i> Merge Cells</button>
          <button class="context-item" data-action="split-cell"><i class="fas fa-object-ungroup"></i> Split Cell</button>
        </div>
      </div>
    `;
    
    $('body').append(menuHtml);
    
    $('.context-item').on('click', function() {
      const action = $(this).data('action');
      handleTableAction(action, $table, $cell, rowIndex, colIndex);
      $('.table-context-menu').remove();
    });
    
    // Close menu on click outside
    $(document).on('click.context-menu', function() {
      $('.table-context-menu').remove();
      $(document).off('click.context-menu');
    });
  }
  
  function handleTableAction(action, $table, $cell, rowIndex, colIndex) {
    const $tbody = $table.find('tbody');
    const $thead = $table.find('thead');
    
    switch(action) {
      case 'insert-row-above':
        const $newRowAbove = $cell.parent().clone();
        $newRowAbove.find('td, th').text('').removeAttr('rowspan colspan');
        $cell.parent().before($newRowAbove);
        break;
        
      case 'insert-row-below':
        const $newRowBelow = $cell.parent().clone();
        $newRowBelow.find('td, th').text('').removeAttr('rowspan colspan');
        $cell.parent().after($newRowBelow);
        break;
        
      case 'insert-col-left':
        $table.find('tr').each(function() {
          const $row = $(this);
          const $cells = $row.find('td, th');
          if ($cells.length > colIndex) {
            const tagName = $cells.eq(colIndex).prop('tagName').toLowerCase();
            const $newCell = $(`<${tagName}></${tagName}>`);
            $cells.eq(colIndex).before($newCell);
          }
        });
        break;
        
      case 'insert-col-right':
        $table.find('tr').each(function() {
          const $row = $(this);
          const $cells = $row.find('td, th');
          if ($cells.length > colIndex) {
            const tagName = $cells.eq(colIndex).prop('tagName').toLowerCase();
            const $newCell = $(`<${tagName}></${tagName}>`);
            $cells.eq(colIndex).after($newCell);
          }
        });
        break;
        
      case 'delete-row':
        if ($table.find('tr').length > 1) {
          $cell.parent().remove();
        }
        break;
        
      case 'delete-col':
        if ($table.find('tr:first td, tr:first th').length > 1) {
          $table.find('tr').each(function() {
            $(this).find('td, th').eq(colIndex).remove();
          });
        }
        break;
    }
  }
  
  // Initialize table interactions
  function initializeTableInteractions(tableId) {
    const $tableFigure = $(`[data-table-id="${tableId}"]`);
    const $toolbar = $tableFigure.find('.table-toolbar');
    const $table = $tableFigure.find('table');
    
    $tableFigure.on('mouseenter', function() {
      $toolbar.show();
      $(this).addClass('selected');
    }).on('mouseleave', function() {
      if (!$(this).hasClass('editing')) {
        $toolbar.hide();
        $(this).removeClass('selected');
      }
    });
    
    $table.on('click', function(e) {
      e.preventDefault();
      $('.table-figure').removeClass('selected editing');
      $('.table-toolbar').hide();
      $tableFigure.addClass('selected editing');
      $toolbar.show();
    });
    
    $toolbar.find('.tbl-btn').on('click', function(e) {
      e.preventDefault();
      const action = $(this).data('action');
      handleTableToolbarAction(action, $table, $tableFigure);
    });
  }
  
  function handleTableToolbarAction(action, $table, $tableFigure) {
    const rowCount = $table.find('tr').length;
    const colCount = $table.find('tr:first td, tr:first th').length;
    
    switch(action) {
      case 'add-row-above':
        const $firstRow = $table.find('tr:first');
        const $newRowAbove = $firstRow.clone();
        $newRowAbove.find('td, th').text('');
        $firstRow.before($newRowAbove);
        break;
        
      case 'add-row-below':
        const $lastRow = $table.find('tr:last');
        const $newRowBelow = $lastRow.clone();
        $newRowBelow.find('td, th').text('');
        $lastRow.after($newRowBelow);
        break;
        
      case 'add-col-left':
        $table.find('tr').each(function() {
          const $firstCell = $(this).find('td, th').first();
          const tagName = $firstCell.prop('tagName').toLowerCase();
          $firstCell.before(`<${tagName}></${tagName}>`);
        });
        break;
        
      case 'add-col-right':
        $table.find('tr').each(function() {
          const $lastCell = $(this).find('td, th').last();
          const tagName = $lastCell.prop('tagName').toLowerCase();
          $lastCell.after(`<${tagName}></${tagName}>`);
        });
        break;
        
      case 'delete-row':
        if (rowCount > 1 && confirm('Delete the last row?')) {
          $table.find('tr:last').remove();
        }
        break;
        
      case 'delete-col':
        if (colCount > 1 && confirm('Delete the last column?')) {
          $table.find('tr').each(function() {
            $(this).find('td, th').last().remove();
          });
        }
        break;
        
      case 'table-props':
        showTableProperties($table);
        break;
        
      case 'delete-table':
        if (confirm('Delete this table?')) {
          $tableFigure.remove();
        }
        break;
    }
  }
  
  function showTableProperties($table) {
    const rowCount = $table.find('tr').length;
    const colCount = $table.find('tr:first td, tr:first th').length;
    const hasHeader = $table.find('thead').length > 0;
    const isResponsive = $table.closest('.table-responsive').length > 0;
    const hasHover = $table.hasClass('hover-table');
    const isSortable = $table.hasClass('sortable-table');
    const isEditable = $table.hasClass('editable-table');
    const isResizable = $table.hasClass('resizable-table');
    
    showTableBuilderForUpdate($table, {
      rows: rowCount,
      cols: colCount,
      template: hasHeader ? 'header' : 'simple',
      responsive: isResponsive,
      hover: hasHover,
      sortable: isSortable,
      editable: isEditable,
      resizable: isResizable
    });
  }
  
  function showTableBuilderForUpdate($existingTable, currentSettings) {
    const tableBuilderHtml = `
      <div class="ranjit-modal-content table-builder-modal">
        <span class="ranjit-modal-close">&times;</span>
        <h3>📊 Update Table Settings</h3>
        
        <div class="table-builder-section">
          <h4>🎯 Current Table: ${currentSettings.rows} × ${currentSettings.cols}</h4>
        </div>
        

        
        <div class="table-builder-section">
          <h4>🎨 Table Styles</h4>
          <div class="table-templates">
            <button class="template-btn ${currentSettings.template === 'simple' ? 'active' : ''}" data-template="simple">
              <div class="template-preview"><div class="mini-table simple"></div></div>
              <span>Simple</span>
            </button>
            <button class="template-btn ${currentSettings.template === 'header' ? 'active' : ''}" data-template="header">
              <div class="template-preview"><div class="mini-table header"></div></div>
              <span>Header</span>
            </button>
            <button class="template-btn ${currentSettings.template === 'striped' ? 'active' : ''}" data-template="striped">
              <div class="template-preview"><div class="mini-table striped"></div></div>
              <span>Striped</span>
            </button>
            <button class="template-btn ${currentSettings.template === 'bordered' ? 'active' : ''}" data-template="bordered">
              <div class="template-preview"><div class="mini-table bordered"></div></div>
              <span>Bordered</span>
            </button>
            <button class="template-btn ${currentSettings.template === 'modern' ? 'active' : ''}" data-template="modern">
              <div class="template-preview"><div class="mini-table modern"></div></div>
              <span>Modern</span>
            </button>
            <button class="template-btn ${currentSettings.template === 'minimal' ? 'active' : ''}" data-template="minimal">
              <div class="template-preview"><div class="mini-table minimal"></div></div>
              <span>Minimal</span>
            </button>
          </div>
        </div>
        
        <div class="table-builder-section">
          <h4>⚙️ Table Configuration</h4>
          <div class="table-config-grid">
            <div class="config-group">
              <label>📏 Table Size</label>
              <div class="dimension-inputs">
                <input type="number" id="updateRows" value="${currentSettings.rows}" min="1" max="20" placeholder="Rows">
                <span>×</span>
                <input type="number" id="updateCols" value="${currentSettings.cols}" min="1" max="15" placeholder="Cols">
              </div>
            </div>
            <div class="config-group">
              <label>📐 Width</label>
              <select id="tableWidth" class="ranjit-select">
                <option value="100">🔲 Full Width (100%)</option>
                <option value="75">📏 Large (75%)</option>
                <option value="50">📐 Medium (50%)</option>
                <option value="auto">📦 Auto Fit</option>
              </select>
            </div>
            <div class="config-group">
              <label>🎨 Theme</label>
              <select id="tableColorTheme" class="ranjit-select">
                <option value="blue">🌊 Blue Ocean</option>
                <option value="green">🌲 Forest Green</option>
                <option value="purple">👑 Royal Purple</option>
                <option value="red">🔥 Crimson Red</option>
                <option value="orange">🌅 Sunset Orange</option>
                <option value="dark">🌙 Dark Mode</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="table-builder-section">
          <h4>🔧 Advanced Features</h4>
          <div class="feature-toggles">
            <label class="feature-toggle">
              <input type="checkbox" id="tableResponsive" ${currentSettings.responsive ? 'checked' : ''}>
              <span class="toggle-slider"></span>
              <div class="toggle-content">
                <strong>📱 Responsive</strong>
                <small>Auto-scroll on mobile devices</small>
              </div>
            </label>
            <label class="feature-toggle">
              <input type="checkbox" id="tableHover" ${currentSettings.hover ? 'checked' : ''}>
              <span class="toggle-slider"></span>
              <div class="toggle-content">
                <strong>🖱️ Hover Effects</strong>
                <small>Highlight rows on hover</small>
              </div>
            </label>
            <label class="feature-toggle">
              <input type="checkbox" id="tableSortable" ${currentSettings.sortable ? 'checked' : ''}>
              <span class="toggle-slider"></span>
              <div class="toggle-content">
                <strong>🔄 Sortable</strong>
                <small>Click headers to sort data</small>
              </div>
            </label>
            <label class="feature-toggle">
              <input type="checkbox" id="tableEditable" ${currentSettings.editable ? 'checked' : ''}>
              <span class="toggle-slider"></span>
              <div class="toggle-content">
                <strong>✏️ Editable</strong>
                <small>Click cells to edit content</small>
              </div>
            </label>
            <label class="feature-toggle">
              <input type="checkbox" id="tableResizable" ${currentSettings.resizable ? 'checked' : ''}>
              <span class="toggle-slider"></span>
              <div class="toggle-content">
                <strong>↔️ Resizable</strong>
                <small>Drag column borders to resize</small>
              </div>
            </label>
          </div>
        </div>
        
        <div class="table-actions">
          <button class="table-btn primary" id="updateTableBtn">✨ Update Table</button>
          <button class="table-btn secondary" onclick="$('#ranjitTableModal').hide();">❌ Cancel</button>
        </div>
      </div>
    `;
    
    $('#ranjitTableModal').html(tableBuilderHtml).css('display', 'flex');
    
    let selectedTemplate = currentSettings.template;
    

    
    // Grid hover effects
    $('#ranjitTableModal').off('mouseenter', '.grid-cell').on('mouseenter', '.grid-cell', function() {
      const row = $(this).data('row');
      const col = $(this).data('col');
      
      $('.grid-cell').removeClass('active');
      for (let r = 1; r <= row; r++) {
        for (let c = 1; c <= col; c++) {
          $(`.grid-cell[data-row="${r}"][data-col="${c}"]`).addClass('active');
        }
      }
      $('#gridInfo').text(`${row} × ${col} table`);
    });
    
    // Grid click to update table
    $('#ranjitTableModal').off('click', '.grid-cell').on('click', '.grid-cell', function() {
      const rows = $(this).data('row');
      const cols = $(this).data('col');
      const options = {
        responsive: $('#tableResponsive').is(':checked'),
        hover: $('#tableHover').is(':checked'),
        sortable: $('#tableSortable').is(':checked'),
        editable: $('#tableEditable').is(':checked'),
        resizable: $('#tableResizable').is(':checked'),
        colorTheme: $('#tableColorTheme').val(),
        width: $('#tableWidth').val()
      };
      updateExistingTable($existingTable, selectedTemplate, options);
      $('#ranjitTableModal').hide();
    });
    
    $('#ranjitTableModal').off('click', '.template-btn').on('click', '.template-btn', function() {
      $('.template-btn').removeClass('active');
      $(this).addClass('active');
      selectedTemplate = $(this).data('template');
    });
    
    $('#updateTableBtn').on('click', function() {
      const newRows = parseInt($('#updateRows').val()) || currentSettings.rows;
      const newCols = parseInt($('#updateCols').val()) || currentSettings.cols;
      const options = {
        responsive: $('#tableResponsive').is(':checked'),
        hover: $('#tableHover').is(':checked'),
        sortable: $('#tableSortable').is(':checked'),
        editable: $('#tableEditable').is(':checked'),
        resizable: $('#tableResizable').is(':checked'),
        colorTheme: $('#tableColorTheme').val(),
        width: $('#tableWidth').val()
      };
      
      updateExistingTable($existingTable, selectedTemplate, options, newRows, newCols);
      $('#ranjitTableModal').hide();
    });
  }
  
  function updateExistingTable($table, template, options, newRows, newCols) {
    const currentRows = $table.find('tr').length;
    const currentCols = $table.find('tr:first td, tr:first th').length;
    
    // Update table dimensions if changed
    if (newRows && newCols && (newRows !== currentRows || newCols !== currentCols)) {
      // Add/remove rows
      while ($table.find('tr').length < newRows) {
        const $lastRow = $table.find('tr:last');
        const $newRow = $lastRow.clone();
        $newRow.find('td, th').text('');
        $lastRow.after($newRow);
      }
      while ($table.find('tr').length > newRows) {
        $table.find('tr:last').remove();
      }
      
      // Add/remove columns
      $table.find('tr').each(function() {
        const $row = $(this);
        const cellTag = $row.find('th').length ? 'th' : 'td';
        
        while ($row.find('td, th').length < newCols) {
          $row.append(`<${cellTag}></${cellTag}>`);
        }
        while ($row.find('td, th').length > newCols) {
          $row.find('td, th').last().remove();
        }
      });
    }
    
    // Update table classes
    $table.removeClass('hover-table sortable-table editable-table resizable-table');
    let tableClasses = 'ranjit-table';
    if (options.responsive) tableClasses += ' responsive-table';
    if (options.hover) tableClasses += ' hover-table';
    if (options.sortable) tableClasses += ' sortable-table';
    if (options.editable) tableClasses += ' editable-table';
    if (options.resizable) tableClasses += ' resizable-table';
    $table.attr('class', tableClasses);
    
    // Update table styling
    if (options.width) {
      const width = options.width === 'auto' ? 'auto' : options.width + '%';
      $table.css('width', width);
    }
    
    // Apply color theme
    if (options.colorTheme) {
      const colorThemes = {
        blue: { primary: '#667eea', secondary: '#764ba2' },
        green: { primary: '#28a745', secondary: '#20c997' },
        purple: { primary: '#6f42c1', secondary: '#e83e8c' },
        red: { primary: '#dc3545', secondary: '#fd7e14' },
        orange: { primary: '#fd7e14', secondary: '#ffc107' },
        dark: { primary: '#2d3748', secondary: '#4a5568' }
      };
      const theme = colorThemes[options.colorTheme] || colorThemes.blue;
      $table.find('th').css({
        'background': `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
        'color': 'white'
      });
    }
    
    const hasHeader = template === 'header' || template === 'modern' || options.sortable;
    if (hasHeader && !$table.find('thead').length) {
      const $firstRow = $table.find('tr:first');
      $firstRow.find('td').each(function() {
        const $td = $(this);
        const $th = $('<th></th>').html($td.html());
        $td.replaceWith($th);
      });
      $firstRow.wrap('<thead></thead>');
    }
    
    const tableId = $table.attr('id');
    if (options.sortable) addTableSortability(tableId);
    if (options.editable) addTableEditability(tableId);
    if (options.resizable) addTableResizability(tableId);
  }
  
  // Legacy function for backward compatibility
  function createTable(editorInstance, rows, cols, template) {
    createAdvancedTable(editorInstance, rows, cols, template, {
      responsive: true,
      hover: false,
      sortable: false,
      colorTheme: 'blue',
      width: '100'
    });
  }

  // Shared event handlers
  $(function () {
    // Ensure required elements exist
    ensureRequiredElements();
    // Legacy image upload (fallback)
    $("#ranjitImageUpload").on("change", function () {
      if (this.files && this.files[0] && activeEditorInstance) {
        const file = this.files[0];
        if (file.size > 2 * 1024 * 1024) {
          alert('Image size should be less than 2MB');
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const imgHtml = `<img src="${e.target.result}" alt="Image" style="width: 50%; height: auto; margin: 10px 0;" class="editor-image">`;
          activeEditorInstance.exec('insertHTML', imgHtml);
        };
        reader.readAsDataURL(file);
        $(this).val('');
      }
    });
    
    // Emoji selection
    $(document).on('click', '.emoji-item', function() {
      const emoji = $(this).data('emoji');
      if (activeEditorInstance) {
        activeEditorInstance.insertEmoji(emoji);
        $('.ranjit-modal-overlay').hide();
      }
    });
    
    // Table grid reset on mouse leave
    $(document).on('mouseleave', '.table-grid-selector', function() {
      $('.grid-cell').removeClass('active');
      $('#gridInfo').text('Hover to select');
    });
    
    // Video upload area drag and drop
    $(document).on('dragover', '#videoUploadArea', function(e) {
      e.preventDefault();
      $(this).addClass('drag-over');
    }).on('dragleave', '#videoUploadArea', function() {
      $(this).removeClass('drag-over');
    }).on('drop', '#videoUploadArea', function(e) {
      e.preventDefault();
      $(this).removeClass('drag-over');
      const file = e.originalEvent.dataTransfer.files[0];
      if (file && file.type.startsWith('video/')) {
        $('#videoFileInput')[0].files = e.originalEvent.dataTransfer.files;
        $('#videoFileInput').trigger('change');
      }
    });
    
    // Import/Export dropdown events - direct handling
    $(document).on('click', '.dropdown-toggle', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const command = $(this).data('command');
      const $target = $(e.target);
      
      // Handle direct image insert (primary action) - single click only
      if (command === 'insertImageDirect') {
        // Check if clicked on dropdown arrow or chevron
        if ($target.hasClass('dropdown-arrow') || $target.hasClass('fa-chevron-down')) {
          // Show dropdown menu
          const $menu = $(this).siblings('.dropdown-menu');
          $('.dropdown-menu').not($menu).hide();
          $menu.toggle();
        } else {
          // Direct image upload (main button click)
          if (activeEditorInstance) {
            openDirectImageUpload(activeEditorInstance);
          }
        }
        return;
      }
      
      // Handle other dropdown toggles
      const $menu = $(this).siblings('.dropdown-menu');
      $('.dropdown-menu').not($menu).hide();
      $menu.toggle();
    });
    
    $(document).on('click', '.dropdown-item', function(e) {
      e.preventDefault();
      $('.dropdown-menu').hide();
      const command = $(this).data('command');
      console.log('Dropdown item clicked:', command); // Debug
      
      if (activeEditorInstance && command) {
        // Handle import/export commands directly
        if (command.startsWith('import')) {
          handleImport(activeEditorInstance, command);
        } else if (command.startsWith('export')) {
          handleExport(activeEditorInstance, command);
        } else {
          // Focus editor first, then execute command
          activeEditorInstance.$contentArea.focus();
          activeEditorInstance.exec(command);
        }
      }
    });
    
    // Close dropdown when clicking outside
    $(document).on('click', function() {
      $('.dropdown-menu').hide();
    });
    
    // Prevent dropdown from closing when clicking inside
    $(document).on('click', '.dropdown-menu', function(e) {
      e.stopPropagation();
    });
    
    // Modal events
    $(document)
      .on("click", ".ranjit-modal-overlay, .ranjit-modal-close", function () {
        $(".ranjit-modal-overlay").hide();
      })
      .on("click", ".ranjit-modal-content", (e) => e.stopPropagation())
      .on("click", ".table-builder-modal", (e) => e.stopPropagation())
      .on("click", ".video-builder-modal", (e) => e.stopPropagation());
      
    // Prevent form submission on Enter in editor
    $(document).on('keydown', '.ranjit-editor-content', function(e) {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        $(this).closest('form').submit();
      }
    });
    
    // Click outside to deselect images/videos/tables
    $(document).on('click', '.ranjit-editor-content', function(e) {
      if (!$(e.target).closest('.image-figure, .video-figure, .table-figure').length) {
        $('.image-figure, .video-figure, .table-figure').removeClass('selected editing');
        $('.image-resize-handles, .image-toolbar, .video-overlay, .table-toolbar').hide();
      }
    });
    
    // Prevent image toolbar from triggering image upload
    $(document).on('click', '.img-btn', function(e) {
      e.stopPropagation();
    });
    
    // Legacy media editing functionality (fallback)
    $(document).on('dblclick', '.editable-media', function(e) {
      e.preventDefault();
      const $media = $(this);
      const type = $media.data('type');
      
      if (type === 'image') {
        editImage($media);
      } else if (type === 'video') {
        editVideo($media);
      }
    });
  });
  
  // Edit image function
  function editImage($img) {
    const currentSrc = $img.attr('src');
    const currentAlt = $img.attr('alt') || 'Image';
    const currentStyle = $img.attr('style') || '';
    
    const widthMatch = currentStyle.match(/width:\s*(\d+)%/);
    const currentSize = widthMatch ? widthMatch[1] : '50';
    
    let currentAlign = 'left';
    if (currentStyle.includes('float: right')) currentAlign = 'right';
    else if (currentStyle.includes('margin: 15px auto') || currentStyle.includes('margin:15px auto')) currentAlign = 'center';
    
    const editHtml = `
      <div class="ranjit-modal-content image-edit-modal">
        <span class="ranjit-modal-close">&times;</span>
        <h3>🖼️ Edit Image</h3>
        
        <div class="image-preview-container">
          <img id="editImagePreview" src="${currentSrc}" alt="${currentAlt}" style="max-width: 100%; max-height: 200px; border-radius: 8px;">
        </div>
        
        <div class="image-controls">
          <div class="control-group">
            <label>📏 Size:</label>
            <div class="size-buttons">
              <button class="size-btn ${currentSize == '25' ? 'active' : ''}" data-size="25">25%</button>
              <button class="size-btn ${currentSize == '50' ? 'active' : ''}" data-size="50">50%</button>
              <button class="size-btn ${currentSize == '75' ? 'active' : ''}" data-size="75">75%</button>
              <button class="size-btn ${currentSize == '100' ? 'active' : ''}" data-size="100">100%</button>
            </div>
          </div>
          
          <div class="control-group">
            <label>📍 Alignment:</label>
            <div class="align-buttons">
              <button class="align-btn ${currentAlign == 'left' ? 'active' : ''}" data-align="left"><i class="fas fa-align-left"></i> Left</button>
              <button class="align-btn ${currentAlign == 'center' ? 'active' : ''}" data-align="center"><i class="fas fa-align-center"></i> Center</button>
              <button class="align-btn ${currentAlign == 'right' ? 'active' : ''}" data-align="right"><i class="fas fa-align-right"></i> Right</button>
            </div>
          </div>
          
          <div class="control-group">
            <label>✏️ Alt Text:</label>
            <input type="text" id="editImageAlt" value="${currentAlt}" placeholder="Describe the image...">
          </div>
          
          <div class="edit-buttons">
            <button class="image-btn ranjit-primary" id="updateImageBtn">✨ Update Image</button>
            <button class="image-btn danger" id="deleteImageBtn">🗑️ Delete Image</button>
          </div>
        </div>
      </div>
    `;
    
    $('#ranjitImageModal').html(editHtml).css('display', 'flex');
    
    $('.size-btn').on('click', function() {
      $('.size-btn').removeClass('active');
      $(this).addClass('active');
    });
    
    $('.align-btn').on('click', function() {
      $('.align-btn').removeClass('active');
      $(this).addClass('active');
    });
    
    $('#updateImageBtn').on('click', function() {
      const size = $('.size-btn.active').data('size');
      const align = $('.align-btn.active').data('align');
      const alt = $('#editImageAlt').val();
      
      let containerStyle = 'margin: 15px 0; clear: both;';
      let imgStyle = `width: ${size}%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); cursor: pointer; display: block;`;
      
      if (align === 'center') {
        containerStyle += ' text-align: center;';
        imgStyle += ' margin: 0 auto;';
      } else if (align === 'right') {
        containerStyle += ' text-align: right;';
        imgStyle += ' margin-left: auto;';
      } else {
        containerStyle += ' text-align: left;';
        imgStyle += ' margin-right: auto;';
      }
      
      const $wrapper = $img.closest('.image-wrapper');
      if ($wrapper.length) {
        $wrapper.attr('style', containerStyle);
        $img.attr('style', imgStyle).attr('alt', alt);
      } else {
        // Wrap existing image if not wrapped
        $img.wrap(`<div class="image-wrapper" style="${containerStyle}"></div>`);
        $img.attr('style', imgStyle).attr('alt', alt);
      }
      
      $('#ranjitImageModal').hide();
    });
    
    $('#deleteImageBtn').on('click', function() {
      if (confirm('Delete this image?')) {
        const $wrapper = $img.closest('.image-wrapper');
        if ($wrapper.length) {
          $wrapper.remove();
        } else {
          $img.remove();
        }
        $('#ranjitImageModal').hide();
      }
    });
  }
  
  // Edit video function
  function editVideo($video) {
    const currentStyle = $video.attr('style') || '';
    const $iframe = $video.find('iframe');
    const $videoEl = $video.find('video');
    
    let currentSize = '560';
    if ($iframe.length) {
      const width = $iframe.attr('width');
      if (width && width.includes('px')) {
        currentSize = width.replace('px', '');
      }
    } else if ($videoEl.length) {
      const width = $videoEl.attr('width');
      if (width && width.includes('px')) {
        currentSize = width.replace('px', '');
      }
    }
    
    let currentAlign = 'center';
    if (currentStyle.includes('text-align: left')) currentAlign = 'left';
    else if (currentStyle.includes('text-align: right')) currentAlign = 'right';
    
    const editHtml = `
      <div class="ranjit-modal-content video-edit-modal">
        <span class="ranjit-modal-close">&times;</span>
        <h3>🎥 Edit Video</h3>
        
        <div class="video-preview-container">
          ${$video.html()}
        </div>
        
        <div class="video-controls">
          <div class="control-group">
            <label>📏 Size:</label>
            <div class="size-buttons">
              <button class="size-btn ${currentSize == '400' ? 'active' : ''}" data-size="400">Small</button>
              <button class="size-btn ${currentSize == '560' ? 'active' : ''}" data-size="560">Medium</button>
              <button class="size-btn ${currentSize == '800' ? 'active' : ''}" data-size="800">Large</button>
            </div>
          </div>
          
          <div class="control-group">
            <label>📍 Alignment:</label>
            <div class="align-buttons">
              <button class="align-btn ${currentAlign == 'left' ? 'active' : ''}" data-align="left"><i class="fas fa-align-left"></i> Left</button>
              <button class="align-btn ${currentAlign == 'center' ? 'active' : ''}" data-align="center"><i class="fas fa-align-center"></i> Center</button>
              <button class="align-btn ${currentAlign == 'right' ? 'active' : ''}" data-align="right"><i class="fas fa-align-right"></i> Right</button>
            </div>
          </div>
          
          <div class="edit-buttons">
            <button class="video-btn ranjit-primary" id="updateVideoBtn">✨ Update Video</button>
            <button class="video-btn danger" id="deleteVideoBtn">🗑️ Delete Video</button>
          </div>
        </div>
      </div>
    `;
    
    $('#ranjitVideoModal').html(editHtml).css('display', 'flex');
    
    $('.size-btn').on('click', function() {
      $('.size-btn').removeClass('active');
      $(this).addClass('active');
    });
    
    $('.align-btn').on('click', function() {
      $('.align-btn').removeClass('active');
      $(this).addClass('active');
    });
    
    $('#updateVideoBtn').on('click', function() {
      const size = $('.size-btn.active').data('size');
      const align = $('.align-btn.active').data('align');
      
      let containerStyle = 'margin: 20px 0; cursor: pointer;';
      
      if (align === 'center') {
        containerStyle += ' text-align: center;';
      } else if (align === 'right') {
        containerStyle += ' text-align: right;';
      } else {
        containerStyle += ' text-align: left;';
      }
      
      $video.attr('style', containerStyle);
      $video.find('iframe, video').css({
        'width': size + 'px',
        'height': Math.round(size * 0.5625) + 'px'
      });
      
      $('#ranjitVideoModal').hide();
    });
    
    $('#deleteVideoBtn').on('click', function() {
      if (confirm('Delete this video?')) {
        $video.remove();
        $('#ranjitVideoModal').hide();
      }
    });
  }
  
  // Handle single dropped image
  function handleSingleDroppedImage(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        let { width, height } = img;
        const maxSize = 1200;
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        if ($('#imagePreview').length) {
          $('#imagePreview').attr('src', compressedDataUrl);
          $('#imagePreviewSection').show();
          window.currentImageData = { src: compressedDataUrl, width, height, size: 50, align: 'left', display: 'inline', alt: 'Image' };
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  
  // Import/Export functionality
  function handleImport(editorInstance, command) {
    console.log('handleImport called with:', command);
    const fileInput = document.getElementById('ranjitImportFileInput');
    
    // Set accept attribute based on command
    if (command === 'importWord') {
      fileInput.accept = '.docx,.doc';
    } else if (command === 'importText') {
      fileInput.accept = '.txt,.html,.htm';
    }
    
    fileInput.onchange = function(e) {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = function(event) {
        let content = event.target.result;
        
        if (file.name.endsWith('.txt')) {
          // Convert plain text to HTML with line breaks
          content = content.replace(/\n/g, '<br>').replace(/\r/g, '');
          content = `<p>${content}</p>`;
        } else if (file.name.endsWith('.html') || file.name.endsWith('.htm')) {
          // Extract body content if full HTML
          const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
          if (bodyMatch) {
            content = bodyMatch[1];
          }
        } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
          // For Word files, show message (requires server-side processing)
          alert('Word import requires server-side processing.\n\nTo import Word content:\n1. Open your Word document\n2. Select all content (Ctrl+A)\n3. Copy (Ctrl+C)\n4. Paste into the editor (Ctrl+V)');
          return;
        }
        
        // Insert imported content
        if (confirm('Replace current content with imported content?')) {
          editorInstance.$contentArea.html(content);
          editorInstance.updateCounts();
          editorInstance.saveState();
        } else {
          editorInstance.$contentArea.append('<hr>' + content);
          editorInstance.updateCounts();
          editorInstance.saveState();
        }
      };
      
      reader.readAsText(file);
      fileInput.value = ''; // Reset for next import
    };
    
    fileInput.click();
  }
  
  function handleExport(editorInstance, command) {
    console.log('handleExport called with:', command);
    const content = getCleanHTML(editorInstance);
    const textContent = editorInstance.$contentArea.text();
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    
    switch (command) {
      case 'exportWord':
        exportToWord(content, `ranjit-editor-${timestamp}.docx`);
        break;
      case 'exportPdf':
        exportToPdf(content, `ranjit-editor-${timestamp}.pdf`);
        break;
      case 'exportHtml':
        exportToHtml(content, `ranjit-editor-${timestamp}.html`);
        break;
      case 'exportText':
        exportToText(textContent, `ranjit-editor-${timestamp}.txt`);
        break;
    }
  }
  
  function exportToWord(content, filename) {
    // Create Word-compatible HTML
    const wordHtml = `
      <!DOCTYPE html>
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
      <head>
        <meta charset='utf-8'>
        <title>Ranjit Editor Export</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
          h1, h2, h3, h4, h5, h6 { color: #333; margin-top: 20px; }
          p { margin-bottom: 10px; }
          table { border-collapse: collapse; width: 100%; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          img { max-width: 100%; height: auto; }
          blockquote { border-left: 4px solid #ccc; margin: 20px 0; padding: 10px 20px; background: #f9f9f9; }
        </style>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `;
    
    const blob = new Blob([wordHtml], { type: 'application/msword' });
    downloadFile(blob, filename);
  }
  
  function exportToPdf(content, filename) {
    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank');
    const pdfHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset='utf-8'>
        <title>Ranjit Editor - PDF Export</title>
        <style>
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 40px;
            color: #333;
          }
          h1, h2, h3, h4, h5, h6 {
            color: #333;
            margin-top: 20px;
            page-break-after: avoid;
          }
          p { margin-bottom: 10px; }
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
            page-break-inside: avoid;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          img {
            max-width: 100%;
            height: auto;
            page-break-inside: avoid;
          }
          blockquote {
            border-left: 4px solid #ccc;
            margin: 20px 0;
            padding: 10px 20px;
            background: #f9f9f9;
            page-break-inside: avoid;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .footer {
            text-align: center;
            border-top: 1px solid #ccc;
            padding-top: 20px;
            margin-top: 30px;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Ranjit Editor Document</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>Created with Ranjit Editor - Advanced Rich Text Editor</p>
        </div>
        <div class="no-print" style="position: fixed; top: 10px; right: 10px; z-index: 1000;">
          <button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">📄 Print/Save as PDF</button>
          <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">✖️ Close</button>
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(pdfHtml);
    printWindow.document.close();
    
    // Auto-trigger print dialog after content loads
    printWindow.onload = function() {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  }
  
  function exportToHtml(content, filename) {
    // Use clean HTML that works anywhere
    const cleanContent = getCleanHTML(activeEditorInstance);
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ranjit Editor Export</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.8;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            color: #2d3748;
            font-size: 16px;
          }
          h1, h2, h3, h4, h5, h6 {
            margin: 25px 0 15px 0;
            font-weight: 700;
            line-height: 1.3;
          }
          h1 { font-size: 2.5em; color: #667eea; }
          h2 { font-size: 2em; color: #667eea; }
          h3 { font-size: 1.5em; color: #764ba2; }
          h4 { font-size: 1.25em; color: #764ba2; }
          h5 { font-size: 1.1em; color: #764ba2; }
          h6 { font-size: 1em; color: #764ba2; }
          p { margin: 15px 0; line-height: 1.8; }
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          th, td {
            border: 1px solid #e1e8ed;
            padding: 12px 15px;
            text-align: left;
            transition: all 0.2s ease;
          }
          th {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            font-weight: 600;
          }
          tr:nth-child(even) {
            background: #f8f9fa;
          }
          tr:hover {
            background: rgba(102, 126, 234, 0.1);
          }
          img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            margin: 10px 0;
            transition: all 0.3s ease;
          }
          img:hover {
            transform: scale(1.02);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          }
          iframe {
            max-width: 100%;
            width: 100%;
            height: 315px;
            border: none;
            border-radius: 8px;
            margin: 10px 0;
          }
          blockquote {
            border-left: 4px solid #667eea;
            margin: 20px 0;
            padding: 15px 20px;
            background: #f8f9fa;
            border-radius: 0 8px 8px 0;
            font-style: italic;
          }
          pre {
            background: #2d3748;
            color: #e2e8f0;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            font-family: 'Courier New', monospace;
            margin: 20px 0;
          }
          ul, ol {
            padding-left: 30px;
            margin: 15px 0;
          }
          li {
            margin: 8px 0;
            line-height: 1.6;
          }
          a {
            color: #667eea;
            text-decoration: none;
            border-bottom: 1px solid transparent;
            transition: all 0.2s ease;
          }
          a:hover {
            border-bottom-color: #667eea;
          }
          .export-info {
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            margin-bottom: 30px;
            border: 1px solid #e9ecef;
          }
        </style>
      </head>
      <body>
        <div class="export-info">
          <h2>📝 Ranjit Editor Export</h2>
          <p>Exported on ${new Date().toLocaleString()}</p>
        </div>
        <div class="content">
          ${cleanContent}
        </div>
        <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;">
        <p style="text-align: center; color: #666; font-size: 14px;">
          Created with <strong>Ranjit Editor</strong> - Advanced Rich Text Editor
        </p>
      </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    downloadFile(blob, filename);
  }
  
  function exportToText(content, filename) {
    // Clean up text content
    const cleanText = content
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();
    
    const textContent = `Ranjit Editor Export\n${'='.repeat(50)}\n\nExported on: ${new Date().toLocaleString()}\n\n${cleanText}\n\n${'='.repeat(50)}\nCreated with Ranjit Editor - Advanced Rich Text Editor`;
    
    const blob = new Blob([textContent], { type: 'text/plain' });
    downloadFile(blob, filename);
  }
  
  function downloadFile(blob, filename) {
    console.log('Downloading file:', filename);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show success message
    setTimeout(() => {
      const notification = $(`
        <div style="position: fixed; top: 20px; right: 20px; background: linear-gradient(45deg, #28a745, #20c997); color: white; padding: 15px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index: 10000; font-weight: 600;">
          ✅ File exported successfully!
        </div>
      `);
      $('body').append(notification);
      setTimeout(() => notification.fadeOut(() => notification.remove()), 3000);
    }, 100);
  }
  
  // Link Builder functionality
  function showLinkBuilder(editorInstance, selection) {
    const selectedText = window.getSelection().toString().trim();
    
    const linkBuilderHtml = `
      <div class="ranjit-modal-content link-builder-modal">
        <span class="ranjit-modal-close">&times;</span>
        <h3>🔗 Insert Link</h3>
        
        <div class="link-builder-section">
          <div class="ranjit-input-group">
            <label>🔗 Website URL:</label>
            <div class="url-input-wrapper">
              <span class="url-prefix">https://</span>
              <input type="url" id="linkUrl" placeholder="example.com" autofocus class="url-input">
              <button type="button" class="url-validate-btn" id="validateUrl" title="Validate URL">
                <i class="fas fa-check"></i>
              </button>
            </div>
            <small class="input-hint">🌐 Enter website address (without https://)</small>
          </div>
          
          <div class="ranjit-input-group">
            <label>📝 Link Text:</label>
            <input type="text" id="linkText" placeholder="Link text" value="${selectedText}">
            <small class="input-hint">Text that will be displayed as the link</small>
          </div>
          
          <div class="ranjit-input-group">
            <label>🎯 Open Link:</label>
            <div class="radio-group">
              <label class="radio-option">
                <input type="radio" name="linkTarget" value="_self" checked>
                <span class="radio-custom"></span>
                📄 Same Tab (Current Window)
              </label>
              <label class="radio-option">
                <input type="radio" name="linkTarget" value="_blank">
                <span class="radio-custom"></span>
                🆕 New Tab (New Window)
              </label>
            </div>
          </div>
          
          <div class="ranjit-input-group">
            <label>📋 Title (Optional):</label>
            <input type="text" id="linkTitle" placeholder="Link description">
            <small class="input-hint">Tooltip text when hovering over the link</small>
          </div>
          
          <div class="link-preview" id="linkPreview" style="display: none;">
            <h4>🔍 Preview:</h4>
            <div class="preview-container">
              <a href="#" id="previewLink" target="_self">Preview Link</a>
            </div>
          </div>
          
          <div class="link-buttons">
            <button class="link-btn" id="previewLinkBtn">👁️ Preview</button>
            <button class="link-btn ranjit-primary" id="insertLinkBtn">✨ Insert Link</button>
            <button class="link-btn ranjit-secondary" id="removeLinkBtn">🗑️ Remove Link</button>
          </div>
        </div>
      </div>
    `;
    
    $('#ranjitLinkModal').html(linkBuilderHtml).css('display', 'flex');
    
    // Auto-fill if cursor is on existing link
    const $existingLink = $(window.getSelection().anchorNode).closest('a');
    if ($existingLink.length) {
      $('#linkUrl').val($existingLink.attr('href') || '');
      $('#linkText').val($existingLink.text() || '');
      $('#linkTitle').val($existingLink.attr('title') || '');
      const target = $existingLink.attr('target');
      if (target === '_blank') {
        $('input[name="linkTarget"][value="_blank"]').prop('checked', true);
      }
    }
    
    // Preview functionality
    function updatePreview() {
      const url = $('#linkUrl').val().trim();
      const text = $('#linkText').val().trim() || url;
      const target = $('input[name="linkTarget"]:checked').val();
      const title = $('#linkTitle').val().trim();
      
      if (url) {
        $('#linkPreview').show();
        const $previewLink = $('#previewLink');
        $previewLink.attr('href', url)
                   .attr('target', target)
                   .attr('title', title)
                   .text(text);
      } else {
        $('#linkPreview').hide();
      }
    }
    
    // Event handlers
    $('#linkUrl, #linkText, #linkTitle').on('input', updatePreview);
    $('input[name="linkTarget"]').on('change', updatePreview);
    
    $('#previewLinkBtn').on('click', function(e) {
      e.preventDefault();
      updatePreview();
    });
    
    $('#insertLinkBtn').on('click', function() {
      const url = $('#linkUrl').val().trim();
      const text = $('#linkText').val().trim();
      const target = $('input[name="linkTarget"]:checked').val();
      const title = $('#linkTitle').val().trim();
      
      if (!url) {
        alert('Please enter a URL');
        $('#linkUrl').focus();
        return;
      }
      
      // Validate URL format
      try {
        new URL(url.startsWith('http') ? url : 'https://' + url);
      } catch {
        alert('Please enter a valid URL');
        $('#linkUrl').focus();
        return;
      }
      
      const finalUrl = url.startsWith('http') ? url : 'https://' + url;
      const finalText = text || finalUrl;
      
      // Create link HTML
      let linkHtml = `<a href="${finalUrl}"`;
      if (target === '_blank') {
        linkHtml += ` target="_blank" rel="noopener noreferrer"`;
      }
      if (title) {
        linkHtml += ` title="${title}"`;
      }
      linkHtml += `>${finalText}</a>`;
      
      // Insert link
      editorInstance.restoreSelection(selection);
      if (selectedText) {
        // Replace selected text with link
        editorInstance.exec('insertHTML', linkHtml);
      } else {
        // Insert link at cursor
        editorInstance.exec('insertHTML', linkHtml + ' ');
      }
      
      $('#ranjitLinkModal').hide();
    });
    
    $('#removeLinkBtn').on('click', function() {
      editorInstance.restoreSelection(selection);
      editorInstance.exec('unlink');
      $('#ranjitLinkModal').hide();
    });
    
    // Auto-preview on URL input
    $('#linkUrl').on('blur', function() {
      if ($(this).val().trim() && !$('#linkText').val().trim()) {
        // Auto-fill link text if empty
        const url = $(this).val().trim();
        try {
          const domain = new URL(url.startsWith('http') ? url : 'https://' + url).hostname;
          $('#linkText').val(domain.replace('www.', ''));
        } catch {
          $('#linkText').val(url);
        }
      }
      updatePreview();
    });
  }
  
  // Find & Replace functionality
  function showFindReplace(editorInstance) {
    const findReplaceHtml = `
      <div class="ranjit-modal-content find-replace-modal">
        <span class="ranjit-modal-close">&times;</span>
        <h3>🔍 Find & Replace</h3>
        
        <div class="find-replace-section">
          <div class="ranjit-input-group">
            <label>🔍 Find:</label>
            <input type="text" id="findText" placeholder="Enter text to find..." autofocus>
            <div class="find-options">
              <label><input type="checkbox" id="matchCase"> Match Case</label>
              <label><input type="checkbox" id="wholeWord"> Whole Word</label>
              <label><input type="checkbox" id="useRegex"> Regex</label>
            </div>
          </div>
          
          <div class="ranjit-input-group">
            <label>🔄 Replace with:</label>
            <input type="text" id="replaceText" placeholder="Enter replacement text...">
          </div>
          
          <div class="find-stats">
            <span id="findStats">Enter text to search</span>
          </div>
          
          <div class="find-buttons">
            <button class="find-btn" id="findPrevBtn">⬆️ Previous</button>
            <button class="find-btn" id="findNextBtn">⬇️ Next</button>
            <button class="find-btn" id="replaceBtn">🔄 Replace</button>
            <button class="find-btn ranjit-primary" id="replaceAllBtn">🔄 Replace All</button>
          </div>
        </div>
      </div>
    `;
    
    $('#ranjitFindReplaceModal').html(findReplaceHtml).css('display', 'flex');
    
    let currentMatches = [];
    let currentIndex = -1;
    
    function highlightMatches(searchText, options = {}) {
      if (!searchText) {
        clearHighlights();
        $('#findStats').text('Enter text to search');
        return;
      }
      
      clearHighlights();
      const content = editorInstance.$contentArea.html();
      let flags = 'g';
      if (!options.matchCase) flags += 'i';
      
      let pattern;
      if (options.useRegex) {
        try {
          pattern = new RegExp(searchText, flags);
        } catch (e) {
          $('#findStats').text('Invalid regex pattern');
          return;
        }
      } else {
        const escapedText = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        pattern = options.wholeWord ? 
          new RegExp(`\\b${escapedText}\\b`, flags) : 
          new RegExp(escapedText, flags);
      }
      
      const textContent = editorInstance.$contentArea.text();
      const matches = [...textContent.matchAll(pattern)];
      currentMatches = matches;
      
      if (matches.length === 0) {
        $('#findStats').text('No matches found');
        return;
      }
      
      // Highlight matches in HTML
      let highlightedContent = content;
      const sortedMatches = matches.sort((a, b) => b.index - a.index);
      
      sortedMatches.forEach((match, i) => {
        const matchText = match[0];
        const beforeText = textContent.substring(0, match.index);
        const afterText = textContent.substring(match.index + matchText.length);
        
        // Find position in HTML and replace
        const htmlBefore = content.substring(0, getHtmlPosition(content, match.index));
        const htmlAfter = content.substring(getHtmlPosition(content, match.index + matchText.length));
        const highlightHtml = `<mark class="find-highlight" data-match="${matches.length - i - 1}">${matchText}</mark>`;
        
        highlightedContent = htmlBefore + highlightHtml + htmlAfter;
      });
      
      editorInstance.$contentArea.html(highlightedContent);
      $('#findStats').text(`${matches.length} matches found`);
      
      if (matches.length > 0) {
        currentIndex = 0;
        highlightCurrentMatch();
      }
    }
    
    function getHtmlPosition(html, textIndex) {
      let htmlPos = 0;
      let textPos = 0;
      
      while (textPos < textIndex && htmlPos < html.length) {
        if (html[htmlPos] === '<') {
          while (htmlPos < html.length && html[htmlPos] !== '>') {
            htmlPos++;
          }
          htmlPos++;
        } else {
          textPos++;
          htmlPos++;
        }
      }
      
      return htmlPos;
    }
    
    function clearHighlights() {
      editorInstance.$contentArea.find('mark.find-highlight').each(function() {
        $(this).replaceWith($(this).text());
      });
      editorInstance.$contentArea.find('.current-match').removeClass('current-match');
    }
    
    function highlightCurrentMatch() {
      editorInstance.$contentArea.find('.current-match').removeClass('current-match');
      if (currentIndex >= 0 && currentIndex < currentMatches.length) {
        const $currentMatch = editorInstance.$contentArea.find(`mark[data-match="${currentIndex}"]`);
        $currentMatch.addClass('current-match');
        
        // Scroll to match
        if ($currentMatch.length) {
          $currentMatch[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        $('#findStats').text(`${currentIndex + 1} of ${currentMatches.length} matches`);
      }
    }
    
    // Event handlers
    $('#findText').on('input', function() {
      const searchText = $(this).val();
      const options = {
        matchCase: $('#matchCase').is(':checked'),
        wholeWord: $('#wholeWord').is(':checked'),
        useRegex: $('#useRegex').is(':checked')
      };
      highlightMatches(searchText, options);
    });
    
    $('#matchCase, #wholeWord, #useRegex').on('change', function() {
      const searchText = $('#findText').val();
      if (searchText) {
        const options = {
          matchCase: $('#matchCase').is(':checked'),
          wholeWord: $('#wholeWord').is(':checked'),
          useRegex: $('#useRegex').is(':checked')
        };
        highlightMatches(searchText, options);
      }
    });
    
    $('#findNextBtn').on('click', function() {
      if (currentMatches.length > 0) {
        currentIndex = (currentIndex + 1) % currentMatches.length;
        highlightCurrentMatch();
      }
    });
    
    $('#findPrevBtn').on('click', function() {
      if (currentMatches.length > 0) {
        currentIndex = currentIndex <= 0 ? currentMatches.length - 1 : currentIndex - 1;
        highlightCurrentMatch();
      }
    });
    
    $('#replaceBtn').on('click', function() {
      if (currentIndex >= 0 && currentIndex < currentMatches.length) {
        const replaceText = $('#replaceText').val();
        const $currentMatch = editorInstance.$contentArea.find(`mark[data-match="${currentIndex}"]`);
        
        if ($currentMatch.length) {
          $currentMatch.replaceWith(replaceText);
          
          // Re-search to update matches
          const searchText = $('#findText').val();
          const options = {
            matchCase: $('#matchCase').is(':checked'),
            wholeWord: $('#wholeWord').is(':checked'),
            useRegex: $('#useRegex').is(':checked')
          };
          highlightMatches(searchText, options);
        }
      }
    });
    
    $('#replaceAllBtn').on('click', function() {
      const searchText = $('#findText').val();
      const replaceText = $('#replaceText').val();
      
      if (!searchText) return;
      
      const options = {
        matchCase: $('#matchCase').is(':checked'),
        wholeWord: $('#wholeWord').is(':checked'),
        useRegex: $('#useRegex').is(':checked')
      };
      
      let content = editorInstance.$contentArea.text();
      let flags = 'g';
      if (!options.matchCase) flags += 'i';
      
      let pattern;
      if (options.useRegex) {
        try {
          pattern = new RegExp(searchText, flags);
        } catch (e) {
          alert('Invalid regex pattern');
          return;
        }
      } else {
        const escapedText = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        pattern = options.wholeWord ? 
          new RegExp(`\\b${escapedText}\\b`, flags) : 
          new RegExp(escapedText, flags);
      }
      
      const replacedContent = content.replace(pattern, replaceText);
      const replacedCount = (content.match(pattern) || []).length;
      
      editorInstance.$contentArea.text(replacedContent);
      $('#findStats').text(`Replaced ${replacedCount} matches`);
      
      setTimeout(() => {
        $('#ranjitFindReplaceModal').hide();
      }, 1500);
    });
    
    // Close modal cleanup
    $('#ranjitFindReplaceModal').on('hidden', function() {
      clearHighlights();
    });
  }
  
  // Initialize advanced image interactions
  function initializeImageInteractions(imgId) {
    const $img = $(`#${imgId}`);
    const $figure = $img.closest('.image-figure');
    const $handles = $figure.find('.image-resize-handles');
    const $toolbar = $figure.find('.image-toolbar');
    
    // Show/hide controls on hover
    $figure.on('mouseenter', function(e) {
      e.stopPropagation();
      $handles.show();
      $toolbar.show();
      $(this).addClass('selected');
    }).on('mouseleave', function(e) {
      e.stopPropagation();
      if (!$(this).hasClass('editing')) {
        $handles.hide();
        $toolbar.hide();
        $(this).removeClass('selected');
      }
    });
    
    // Single click to select, prevent event bubbling
    $img.on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      $('.image-figure').removeClass('selected editing');
      $('.image-resize-handles, .image-toolbar').hide();
      $figure.addClass('selected editing');
      $handles.show();
      $toolbar.show();
    });
    
    // Resize functionality
    let isResizing = false;
    let startX, startY, startWidth, startHeight;
    
    $handles.find('.resize-handle').on('mousedown', function(e) {
      e.preventDefault();
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startWidth = $img.width();
      startHeight = $img.height();
      
      const direction = $(this).data('direction');
      const containerWidth = $img.closest('.ranjit-editor-content').width();
      
      $(document).on('mousemove.resize', function(e) {
        if (!isResizing) return;
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        let newWidth = startWidth;
        let newHeight = startHeight;
        
        if (direction.includes('e')) newWidth = startWidth + deltaX;
        if (direction.includes('w')) newWidth = startWidth - deltaX;
        if (direction.includes('s')) newHeight = startHeight + deltaY;
        if (direction.includes('n')) newHeight = startHeight - deltaY;
        
        // Maintain aspect ratio
        const aspectRatio = startWidth / startHeight;
        if (direction.includes('e') || direction.includes('w')) {
          newHeight = newWidth / aspectRatio;
        } else if (direction.includes('n') || direction.includes('s')) {
          newWidth = newHeight * aspectRatio;
        }
        
        // Set limits: minimum 50px, maximum container width
        newWidth = Math.max(50, Math.min(newWidth, containerWidth));
        newHeight = Math.max(50, newHeight);
        
        $img.css({ width: newWidth + 'px', height: 'auto' });
      });
      
      $(document).on('mouseup.resize', function() {
        isResizing = false;
        $(document).off('mousemove.resize mouseup.resize');
      });
    });
    
    // Toolbar actions
    $toolbar.find('.img-btn').on('click', function(e) {
      e.preventDefault();
      const action = $(this).data('action');
      
      switch(action) {
        case 'wrap-left':
          $figure.removeClass('center right inline break-text').addClass('left wrap-text');
          break;
        case 'break-center':
          $figure.removeClass('left right inline wrap-text').addClass('center break-text');
          break;
        case 'wrap-right':
          $figure.removeClass('left center inline break-text').addClass('right wrap-text');
          break;
        case 'inline':
          $figure.removeClass('left center right wrap-text break-text').addClass('inline');
          break;
        case 'resize-small':
          $img.css('width', '25%');
          break;
        case 'resize-medium':
          $img.css('width', '50%');
          break;
        case 'resize-large':
          $img.css('width', '75%');
          break;
        case 'resize-full':
          $img.css('width', '100%');
          break;
        case 'edit-alt':
          const currentAlt = $img.attr('alt') || '';
          const newAlt = prompt('Enter alt text:', currentAlt);
          if (newAlt !== null) $img.attr('alt', newAlt);
          break;
        case 'add-caption':
          if (!$figure.find('.image-caption').length) {
            $figure.append('<figcaption class="image-caption" contenteditable="true">Enter caption...</figcaption>');
          }
          $figure.find('.image-caption').focus();
          break;
        case 'copy-image':
          const imgHtml = $figure[0].outerHTML;
          navigator.clipboard.writeText(imgHtml).then(() => {
            showNotification('Image copied to clipboard!');
          });
          break;
        case 'delete':
          if (confirm('Delete this image?')) {
            $figure.remove();
          }
          break;
      }
    });
  }
  
  // Initialize advanced video interactions
  function initializeVideoInteractions(videoId) {
    const $figure = $(`[data-video-id="${videoId}"]`);
    const $overlay = $figure.find('.video-overlay');
    const $toolbar = $figure.find('.video-toolbar');
    
    // Show/hide controls on hover
    $figure.on('mouseenter', function() {
      $overlay.show();
      $(this).addClass('selected');
    }).on('mouseleave', function() {
      if (!$(this).hasClass('editing')) {
        $overlay.hide();
        $(this).removeClass('selected');
      }
    });
    
    // Toolbar actions
    $toolbar.find('.vid-btn').on('click', function(e) {
      e.preventDefault();
      const action = $(this).data('action');
      
      switch(action) {
        case 'replace':
          replaceVideo($figure);
          break;
        case 'wrap-left':
          $figure.removeClass('center right inline break-text').addClass('left wrap-text');
          break;
        case 'break-center':
          $figure.removeClass('left right inline wrap-text').addClass('center break-text');
          break;
        case 'wrap-right':
          $figure.removeClass('left center inline break-text').addClass('right wrap-text');
          break;
        case 'inline':
          $figure.removeClass('left center right wrap-text break-text').addClass('inline');
          break;
        case 'resize-small':
          const $videoSmall = $figure.find('.video-embed');
          $videoSmall.attr('width', '400px').attr('height', '225px');
          break;
        case 'resize-medium':
          const $videoMedium = $figure.find('.video-embed');
          $videoMedium.attr('width', '560px').attr('height', '315px');
          break;
        case 'resize-large':
          const $videoLarge = $figure.find('.video-embed');
          $videoLarge.attr('width', '800px').attr('height', '450px');
          break;
        case 'add-caption':
          if (!$figure.find('.video-caption').length) {
            $figure.append('<figcaption class="video-caption" contenteditable="true">Enter caption...</figcaption>');
          }
          $figure.find('.video-caption').focus();
          break;
        case 'copy-video':
          const videoHtml = $figure[0].outerHTML;
          navigator.clipboard.writeText(videoHtml).then(() => {
            showNotification('Video copied to clipboard!');
          });
          break;
        case 'delete':
          if (confirm('Delete this video?')) {
            $figure.remove();
          }
          break;
      }
    });
  }
  
  // Direct image upload functionality
  function openDirectImageUpload(editorInstance) {
    // Prevent multiple file dialogs
    if (document.querySelector('.temp-file-input')) {
      return;
    }
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*,image/jpeg,image/png,image/gif';
    fileInput.multiple = false;
    fileInput.style.display = 'none';
    fileInput.className = 'temp-file-input';
    
    fileInput.onchange = function(e) {
      const file = e.target.files[0];
      document.body.removeChild(fileInput);
      
      if (!file) {
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) {
        showNotification('Image size should be less than 2MB', 'error');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
          // Compress if needed
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          let { width, height } = img;
          const maxSize = 1200;
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height * maxSize) / width;
              width = maxSize;
            } else {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          
          // Create image data with default settings
          const imageData = {
            src: compressedDataUrl,
            width: width,
            height: height,
            size: 50, // Default 50%
            align: 'left', // Default wrap left
            display: 'wrap-text',
            alt: file.name.replace(/\.[^/.]+$/, '') // Use filename as alt
          };
          
          insertImage(editorInstance, imageData);
          const settings = loadEditorSettings();
          if (settings.showImageSuccess) {
            showNotification('Image inserted successfully!');
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    };
    
    // Clean up on cancel
    fileInput.oncancel = function() {
      document.body.removeChild(fileInput);
    };
    
    document.body.appendChild(fileInput);
    fileInput.click();
  }
  
  // Replace image functionality
  function replaceImage($img) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
    fileInput.onchange = function(e) {
      const file = e.target.files[0];
      if (!file) return;
      
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
          // Compress if needed
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          let { width, height } = img;
          const maxSize = 1200;
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height * maxSize) / width;
              width = maxSize;
            } else {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          $img.attr('src', compressedDataUrl);
          const settings = loadEditorSettings();
          if (settings.showImageSuccess) {
            showNotification('Image replaced successfully!');
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    };
    
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  }
  
  // Replace video functionality
  function replaceVideo($figure) {
    // Show video builder for replacement
    if (activeEditorInstance) {
      showVideoBuilder(activeEditorInstance);
      
      // Auto-remove current video when new one is inserted
      const originalInsert = insertVideo;
      insertVideo = function(editorInstance, videoData) {
        $figure.remove();
        originalInsert(editorInstance, videoData);
        insertVideo = originalInsert; // Restore original function
      };
    }
  }
  
  // Show notification helper
  function showNotification(message, type = 'success') {
    const bgColor = type === 'success' ? 
      'linear-gradient(45deg, #28a745, #20c997)' : 
      'linear-gradient(45deg, #dc3545, #c82333)';
    
    const notification = $(`
      <div style="position: fixed; top: 20px; right: 20px; background: ${bgColor}; color: white; padding: 15px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index: 10000; font-weight: 600; animation: slideInRight 0.3s ease;">
        ${message}
      </div>
    `);
    
    $('body').append(notification);
    setTimeout(() => notification.fadeOut(() => notification.remove()), 3000);
  }
  
  // Handle multiple dropped images
  function handleMultipleDroppedImages(files, editorInstance) {
    const validFiles = files.filter(file => file.size <= 2 * 1024 * 1024);
    
    if (validFiles.length === 0) {
      alert('No valid images found. Please select image files under 2MB.');
      return;
    }
    
    let processedImages = [];
    let processed = 0;
    
    validFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          let { width, height } = img;
          const maxSize = 800;
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height * maxSize) / width;
              width = maxSize;
            } else {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          processedImages[index] = {
            src: compressedDataUrl,
            width,
            height,
            alt: `Gallery Image ${index + 1}`
          };
          
          processed++;
          if (processed === validFiles.length) {
            // All images processed, create gallery
            insertDroppedGallery(editorInstance, processedImages.filter(img => img));
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }
  
  // Insert dropped gallery
  function insertDroppedGallery(editorInstance, images) {
    if (images.length < 2) {
      // If less than 2 images, insert as individual images
      images.forEach(img => {
        const imageData = {
          src: img.src,
          size: 50,
          align: 'left',
          display: 'inline',
          alt: img.alt
        };
        insertImage(editorInstance, imageData);
      });
      return;
    }
    
    // Create responsive gallery layout
    let galleryHtml = '<div class="drag-drop-gallery" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; padding: 15px; background: rgba(102, 126, 234, 0.05); border-radius: 12px; border: 2px dashed rgba(102, 126, 234, 0.2);">';
    
    images.forEach((img, index) => {
      galleryHtml += `
        <div class="gallery-item" style="position: relative; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); transition: all 0.3s ease;">
          <img src="${img.src}" alt="${img.alt}" style="width: 100%; height: 200px; object-fit: cover; display: block; cursor: pointer;" class="editable-media" data-type="image">
          <div class="gallery-overlay" style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.7)); color: white; padding: 10px; font-size: 12px; text-align: center;">
            Image ${index + 1}
          </div>
        </div>
      `;
    });
    
    galleryHtml += '</div><p><br></p>';
    
    editorInstance.$contentArea.focus();
    editorInstance.exec('insertHTML', galleryHtml);
    
    // Show success message
    setTimeout(() => {
      const notification = $(`
        <div style="position: fixed; top: 20px; right: 20px; background: linear-gradient(45deg, #28a745, #20c997); color: white; padding: 15px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index: 10000; font-weight: 600;">
          ✅ ${images.length} images added to gallery!
        </div>
      `);
      $('body').append(notification);
      setTimeout(() => notification.fadeOut(() => notification.remove()), 3000);
    }, 100);
  }

})(jQuery);
