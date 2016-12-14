$(function(){
    var styles = {
        local: {
            $el: $('<style>')
        }
    };
    var $head = $('head');
    
    
    for(var i in styles){ // init styles
        $head.append(styles[i].$el);
        styles[i].CSSStyleSheet = styles[i].$el[0].sheet;
    }
    
    console.log(styles);
    document._styles = styles;
    
    // tests
    //styles.local.CSSStyleSheet.insertRule('body {background: #777;}', styles.local.CSSStyleSheet.cssRules.length);
    
    var $targetStyles = $('#targetStyles');
    var targetSelector = '#target';
    var targetRulesIndex = styles.local.CSSStyleSheet.insertRule(targetSelector+'{'+$targetStyles.val()+'}', styles.local.CSSStyleSheet.cssRules.length);
    
    var ignoreChanges = false;
    function applyTargetStyles(){
        styles.local.CSSStyleSheet.cssRules[targetRulesIndex].style.cssText = $targetStyles.val();
        updateTargetWidthSlider();
        updateTargetHeightSlider();
    };
    function setTargetStylesVal(){
        ignoreChanges = true;
        var text = styles.local.CSSStyleSheet.cssRules[targetRulesIndex].style.cssText||'';
        $targetStyles.val(text.replace(/;/g, ';\n'));
        ignoreChanges = false;
    }
    function updateTargetWidthSlider(){
        $("#targetWidth").simpleSlider("setValue", parseInt(styles.local.CSSStyleSheet.cssRules[targetRulesIndex].style.width));
    }
    function updateTargetHeightSlider(){
        $("#targetHeight").simpleSlider("setValue", parseInt(styles.local.CSSStyleSheet.cssRules[targetRulesIndex].style.height));
    }
    
    //$targetStyles.change(function(){
    $targetStyles.keyup(function(){
        if(!ignoreChanges)
            applyTargetStyles();
    });
    
    $("#targetWidth").bind("slider:changed", function (event, data) {
        styles.local.CSSStyleSheet.cssRules[targetRulesIndex].style.width = parseInt(data.value)+'px';
        setTargetStylesVal();
    });
    $("#targetHeight").bind("slider:changed", function (event, data) {
        styles.local.CSSStyleSheet.cssRules[targetRulesIndex].style.height = parseInt(data.value)+'px';
        setTargetStylesVal();
    });
    setTargetStylesVal();
    updateTargetWidthSlider();
    updateTargetHeightSlider();
    
    
});