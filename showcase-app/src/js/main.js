// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

(function ($, crLib) {
    var LOCAL_STORAGE_THEME_KEY = 'showcase-app-theme';

    function pageInit() {
        enableEditableCode();
        updateActiveMenuEntry();
        enableLoadConfigBtn();
        enableScenarioBtns();
        enableCodePreviewBtn();
        enableChangeTheme();
        enableCodeTabs();
        enableOpenCloseEmulatorScenario();
        enableOpenCloseComponentConfig();
        enableMenuFiltering();

        if (crLib) {
            window.bridgeReceiveIntegerFromNative = crLib.bridgeReceiveIntegerFromNative;
            window.bridgeReceiveBooleanFromNative = crLib.bridgeReceiveBooleanFromNative;
            window.bridgeReceiveStringFromNative = crLib.bridgeReceiveStringFromNative;
            window.bridgeReceiveObjectFromNative = crLib.bridgeReceiveObjectFromNative;
        }

        preloadConfig();
        preloadScenarioAndPreviews(); // preloads scenario, runs it ( if it has an onStart key) and preloads the previews
    }

    function runPageLoadCode() {
        enableEditableCode();
        // updateActiveMenuEntry();
        enableLoadConfigBtn();
        enableScenarioBtns();
        enableCodePreviewBtn();
        setThemeForTestingColors();
        // enableChangeTheme();
        enableCodeTabs();
        enableOpenCloseEmulatorScenario();
        enableOpenCloseComponentConfig();
        enableMenuFiltering();

        if (crLib) {
            window.bridgeReceiveIntegerFromNative = crLib.bridgeReceiveIntegerFromNative;
            window.bridgeReceiveBooleanFromNative = crLib.bridgeReceiveBooleanFromNative;
            window.bridgeReceiveStringFromNative = crLib.bridgeReceiveStringFromNative;
            window.bridgeReceiveObjectFromNative = crLib.bridgeReceiveObjectFromNative;
        }

        preloadConfig();
        preloadScenarioAndPreviews(); // preloads scenario, runs it ( if it has an onStart key) and preloads the previews
    }


    /* ********** Function definitions ***************** */
    function enableEditableCode() {
        $('.editable-code').each(function (i, el) {
            var mode = $(el).data('language');
            var editor = ace.edit(el);
            editor.getSession().setMode('ace/mode/' + mode);
            editor.setTheme('ace/theme/monokai');
            editor.setAutoScrollEditorIntoView(true);
            editor.setOption("minLines", 5);
            editor.setOption("maxLines", 100);
            editor.setFontSize("14px");
            $(el).data('editor', editor);
        });
    }
    function updateActiveMenuEntry() {
        setMenuSelect();
        $('.menu').on('click', 'a', function () {
            var clickedEl = $(this);
            var menuEl = $(clickedEl).parents('.menu');

            if (menuEl && menuEl.length) {
                menuEl.find('.is-active').removeClass('is-active');
            }
            clickedEl.addClass('is-active');
            setMenuSelect();
        });
    }

    function enableOpenCloseEmulatorScenario() {
        $(".emulator-scenario").on("click", ".message-header", function () {
            var el = $(this);
            var sc = el.parents('.emulator-scenario');
            sc.toggleClass('closed')
        });
    }

    function enableOpenCloseComponentConfig() {
        $(".component-configuration").on("click", ".message-header", function () {
            var el = $(this);
            var sc = el.parents('.component-configuration');
            sc.toggleClass('closed')
        });
    }

    function setTheme(themeToEnable) {
        toggleLoading('loading');

        window.activeTheme = themeToEnable;
        localStorage.setItem(LOCAL_STORAGE_THEME_KEY, themeToEnable);

        var existingThemeStyle = document.querySelectorAll('.theme-style');

        $.get(window.availableThemes[themeToEnable].href, function (data) {
            var style = document.createElement('style');
            style.id = themeToEnable;
            style.classList.add('theme-style')
            style.innerHTML = data;

            existingThemeStyle.forEach(element => {
                element.remove();
            });
            document.querySelector('head').append(style);
            toggleLoading('loaded');
        }).fail(function () {
            toggleLoading('error');
        })
    }

    function setThemeForTestingColors(themeToEnable) {
        if (!themeToEnable) {
            themeToEnable = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
        }
        // console.log("themeToEnable", themeToEnable);
        var testArray = document.getElementsByClassName("theme-content-val");
        for (var i = 0; i < testArray.length; i++) {
            testArray[i].classList.remove("light-theme-val");
            testArray[i].classList.remove("dark-theme-val");
            testArray[i].classList.remove("highContrast-theme-val");
            testArray[i].classList.add(themeToEnable + "-theme-val");
        }
    }

    function toggleLoading(state) {
        var loadingSpinner = $('.theme-changer-loading');
        var loaded = $('.theme-changer-loaded');
        var errorFlag = $('.theme-changer-error');

        if (state === 'loaded') {
            hideLoading(loadingSpinner, errorFlag, loaded);
        } else if (state === 'loading') {
            showLoading(loadingSpinner, errorFlag, loaded);
        } else if (state === 'error') {
            hideLoading(loadingSpinner, errorFlag, loaded);
            showErrorFlag(errorFlag, loaded);
        }
    }

    function showLoading(loadingSpinner, errorFlag, loaded) {
        errorFlag.css({ 'display': 'none' });
        loaded.css({ 'display': 'none' })
        loadingSpinner.css({ 'display': 'inline-block' });
    }

    function hideLoading(loadingSpinner, errorFlag, loaded) {
        errorFlag.css({ 'display': 'none' });
        loaded.css({ 'display': 'inline-block' });
        loadingSpinner.css({ 'display': 'none' });
    }

    function showErrorFlag(errorFlag, loaded) {
        loaded.css({ 'display': 'none' });
        errorFlag.css({ 'display': 'inline-block' });
    }

    function enableChangeTheme() {
        var themeChanger = $('.theme-changer');
        var initialTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
        if (initialTheme === null
            || Object.keys(window.availableThemes).indexOf(initialTheme) < 0) {
            initialTheme = 'highContrast';
        }
        setTheme(initialTheme);
        setThemeForTestingColors(initialTheme);
        themeChanger.val(initialTheme);
        themeChanger.show();
        themeChanger.on('change', function () {
            var ch5ThemeName = $(this).val();
            setTheme(ch5ThemeName);
            setThemeForTestingColors(ch5ThemeName);
        });
    }

    function enableCodeTabs() {
        $('.editable-code-sections').on('click', '.tabs li', function () {
            var clickedEl = $(this);
            var section = $(this).parents('.editable-code-sections');

            section.find('.tabs li').removeClass('is-active');
            clickedEl.addClass('is-active');
            section.find('.block-html,.block-js,.block-css').addClass('is-hidden');
            section.find(clickedEl.attr('data-control-block')).removeClass('is-hidden');
        });
    }

    function enableCodePreviewBtn() {
        $(".btn-preview").on('click', function () {
            var currentEl = $(this);
            var ex = $(currentEl).parents('.example');
            var previewHtml = ex.find('.preview');
            var previewJs = ex.find('.js-container');
            var previewCss = ex.find('.css-container');
            var code = ex.find('.editable-code-sections');
            var codeHtml = code.find('.html.editable-code');
            var codeJs = code.find('.js.editable-code');
            var codeCss = code.find('.css.editable-code');
            var jsBeforeHtmlCheckbox = code.find('.execute-js-before-html');
            var executeJsBeforeHtml = false;

            if (jsBeforeHtmlCheckbox && jsBeforeHtmlCheckbox.is(':checked')) {
                executeJsBeforeHtml = true;
            }

            var tCss = document.createElement('style');
            tCss.innerHTML = codeCss.data('editor').getValue();
            previewCss.empty().append(tCss);

            var t = document.createElement('template');
            var html = codeHtml.data('editor').getValue();
            t.innerHTML = html;

            var tJs = document.createElement('script');
            tJs.innerHTML = codeJs.data('editor').getValue();

            if (executeJsBeforeHtml) {
                previewJs.empty().append(tJs);
                previewHtml.empty().append(t.content);
            } else {
                previewHtml.empty().append(t.content);
                previewJs.empty().append(tJs);
            }
        });
    }

    function enableScenarioBtns() {
        var emulator = {};
        $(".btn-load-scenario").on('click', function () {
            var currentEl = $(this);
            var scenario = currentEl.parents('.emulator-scenario').find('.editable-code.json');
            var j = JSON.parse(scenario.data('editor').getValue());

            crLib.Ch5Emulator.clear();
            shouldClearSignals();
            emulator = crLib.Ch5Emulator.getInstance();
            emulator.loadScenario(j);

            console.log('Emulator scenario logic configuration has been loaded');
            // reload all examples on page
            $('.btn-preview').each(function (index, element) {
                $(element).click();
            });
        });

        $(".btn-run-scenario").on('click', function () {
            console.log('Executing keys/states defined on onStart ...');
            emulator.run();
        });
    }

    // Workaround needed for data-ch5-i18n, the problem is solely with the showcase app
    function shouldClearSignals() {
        if (window.location.pathname !== '/multi-language/language-change.html') {
            crLib.Ch5SignalFactory.clear();
        }
    }

    function enableLoadConfigBtn() {
        $(".btn-load-config").on('click', function () {
            var currentEl = $(this);
            var configJsonData = currentEl.parents('.component-configuration').find('.editable-code.json');
            var j = JSON.parse(configJsonData.data('editor').getValue());
            emulator = crLib.Ch5Emulator.getInstance();
            crLib.Ch5Config.loadConfig(j);
            console.log('Component configuration has been loaded');
        });
    }

    function preloadScenarioAndPreviews() {
        $('.btn-load-scenario').click();
        $('.btn-run-scenario').click();
        $('.btn-preview').click();
    }

    function preloadConfig() {
        $('.btn-load-config').click();
    }

    function setMenuSelect() {
        let path = document.location.pathname;
        if (path.trim().length === 0) {
            path = '/index.html';
        } else {
            if (!path.trim().toLowerCase().endsWith(".html")) {
                path += 'index.html';
            }
        }
        // This will need to be adjusted if we have cases with the same pathname in the menu
        let link = $(".menu-list a[onclick='loadPage(\"" + path + "\")']");
        link.not('.menu-label').addClass('is-active');
        link.parents('.menu-list').addClass('is-active');
        // link.not('.menu-label')[0].scrollIntoView();
        if (link.parents('.menu-list') && link.parents('.menu-list').length > 0 && link.parents('.menu-list')[0] && link.parents('.menu-list')[0].previousElementSibling) {
            link.parents('.menu-list')[0].previousElementSibling.scrollIntoView();
        }
        
        document.getElementById('content-block-section').scrollIntoView();
        // document.getElementById('main-center-div').scrollIntoView();
    }

    function enableMenuFiltering() {
        var filterElement = $('#search-term');
        filterElement.on('keyup', function () {
            var filterTerm = '';
            if (filterElement) {
                filterTerm = $(this).val().toLowerCase();
            }

            if (filterTerm !== '') {
                $(".side-menu .menu-list").attr('style', 'display:block');
                $("p.menu-label, .menu-list li").filter(function () {
                    var isShown = false;
                    if ($(this).text().toLowerCase().indexOf(filterTerm) > -1) {
                        isShown = true;
                    }
                    $(this).toggle(isShown);
                });
                $('p.menu-label').filter(function () {
                    var isShown = false;
                    if ($(this).find('a:visible').length > 0
                        || $(this).next('.menu-list').find('li:visible').length > 0) {
                        isShown = true;
                    }
                    $(this).toggle(isShown);
                });
            } else {
                $(".side-menu .menu-list").attr('style', '');
                $(".menu-list li").filter(function () {
                    $(this).toggle(true);
                });
                $('p.menu-label').filter(function () {
                    $(this).toggle(true);
                });
            }
        });
    }

    /**
     * Getting the local file
     * @param url 
     * @return Promise with content from URL  
     */
    function asyncLoadContent(url) {
        return new Promise((resolve, reject) => {
            // Standard XHR to load an image
            const request = new XMLHttpRequest();
            request.open("GET", url);
            // When the request loads, check whether it was successful
            request.onload = () => {
                if (request.status < 300 && request.response !== null
                    && (request.responseType === "" || request.responseType === "text")) {
                    // If successful, resolve the promise by passing back the request response
                    resolve(request.responseText);
                } else {
                    // If it fails, reject the promise with a error message
                    reject(`load failed with status ${request.status}, statusText ${request.statusText}, responseType ${request.responseType}`);
                }
            };
            request.onerror = () => {
                // Also deal with the case when the entire request fails to begin with
                // This is probably a network error, so reject the promise with an appropriate message
                reject("There was a network error.");
            };
            // Send the request
            request.send();
        });
    }

    function loadPage(url) {
        try {
            if (document.getElementById('openSidebarMenu')) {
                document.getElementById('openSidebarMenu').checked = false;
            }
            history.pushState(null, null, url);
            router(url);
        } catch (e) {
            console.warn(e);
        }
    }

    function stringToHTML(str) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(str, 'text/html');
        return doc;
    }

    async function router(url) {
        if (url) {
            const responseHTML = stringToHTML(await asyncLoadContent(url));
            if (responseHTML.getElementsByTagName("title") &&
                responseHTML.getElementsByTagName("title").length > 0 &&
                isValidInput(responseHTML.getElementsByTagName("title")[0].innerText)) {
                document.title = responseHTML.getElementsByTagName("title")[0].innerText;
            } else {
                document.title = "Showcase Application";
            }
            document.getElementById("content-block-section").innerHTML = responseHTML.getElementById("content-block-section").innerHTML;
        } else {
            document.title = "Showcase Application";
        }
        runPageLoadCode();
    }

    function isValidInput(input) {
        input = input.trim();
        if (input === "" || input === null || input === undefined) {
            return false;
        } else {
            return true;
        }
    }
    async function pageInitialLoad() {
        router(location.pathname);
        var menuEl = $('.menu');

        if (menuEl && menuEl.length) {
            menuEl.find('.is-active').removeClass('is-active');
        }
        setMenuSelect();
    }

    window.addEventListener("popstate", pageInitialLoad);
    document.addEventListener("DOMContentLoaded", () => {
        pageInit();
        pageInitialLoad();
        setTimeout(() => {
            document.getElementById("content-block-section").classList.remove("vis-hide");
        }, 300);
    });

    window.loadPage = loadPage;

})(jQuery, CrComLib);

(function ($) {
    $.fn.disableSelection = function () {
        return this.attr('unselectable', 'on')
            .css('user-select', 'none')
            .on('selectstart', false);
    };
    $.fn.enableSelection = function () {
        return this.attr('unselectable', 'off')
            .css('user-select', 'auto')
            .on('selectstart', () => { return true; });
    };
})(jQuery);

$("div.content.preview").disableSelection();
$("ch5-textinput").enableSelection();

