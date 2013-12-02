class @MarkdownEditingDescriptor extends XModule.Descriptor
  # TODO really, these templates should come from or also feed the cheatsheet
  @multipleChoiceTemplate : "( ) incorrect\n( ) incorrect\n(x) correct\n"
  @checkboxChoiceTemplate: "[x] correct\n[ ] incorrect\n[x] correct\n"
  @stringInputTemplate: "= answer\n"
  @numberInputTemplate: "= answer +- x%\n"
  @selectTemplate: "[[incorrect, (correct), incorrect]]\n"
  @headerTemplate: "Header\n=====\n"
  @explanationTemplate: "[explanation]\nShort explanation\n[explanation]\n"

  constructor: (element) ->
    @element = element

    if $(".markdown-box", @element).length != 0
      @markdown_editor = CodeMirror.fromTextArea($(".markdown-box", element)[0], {
      lineWrapping: true
      mode: null
      })
      @setCurrentEditor(@markdown_editor)
      # Add listeners for toolbar buttons (only present for markdown editor)
      @element.on('click', '.xml-tab', @onShowXMLButton)
      @element.on('click', '.format-buttons a', @onToolbarButton)
      @element.on('click', '.cheatsheet-toggle', @toggleCheatsheet)
      # Hide the XML text area
      $(@element.find('.xml-box')).hide()
    else
      @createXMLEditor()

  ###
  Creates the XML Editor and sets it as the current editor. If text is passed in,
  it will replace the text present in the HTML template.

  text: optional argument to override the text passed in via the HTML template
  ###
  createXMLEditor: (text) ->
    @xml_editor = CodeMirror.fromTextArea($(".xml-box", @element)[0], {
    mode: "xml"
    lineNumbers: true
    lineWrapping: true
    })
    if text
      @xml_editor.setValue(text)
    @setCurrentEditor(@xml_editor)

  ###
  User has clicked to show the XML editor. Before XML editor is swapped in,
  the user will need to confirm the one-way conversion.
  ###
  onShowXMLButton: (e) =>
    e.preventDefault();
    if @confirmConversionToXml()
      @createXMLEditor(MarkdownEditingDescriptor.markdownToXml(@markdown_editor.getValue()))
      # Need to refresh to get line numbers to display properly (and put cursor position to 0)
      @xml_editor.setCursor(0)
      @xml_editor.refresh()
      # Hide markdown-specific toolbar buttons
      $(@element.find('.editor-bar')).hide()

  ###
  Have the user confirm the one-way conversion to XML.
  Returns true if the user clicked OK, else false.
  ###
  confirmConversionToXml: ->
    # TODO: use something besides a JavaScript confirm dialog?
    return confirm("If you use the Advanced Editor, this problem will be converted to XML and you will not be able to return to the Simple Editor Interface.\n\nProceed to the Advanced Editor and convert this problem to XML?")

  ###
  Event listener for toolbar buttons (only possible when markdown editor is visible).
  ###
  onToolbarButton: (e) =>
    e.preventDefault();
    selection = @markdown_editor.getSelection()
    revisedSelection = null
    switch $(e.currentTarget).attr('class')
      when "multiple-choice-button" then revisedSelection = MarkdownEditingDescriptor.insertMultipleChoice(selection)
      when "string-button" then revisedSelection = MarkdownEditingDescriptor.insertStringInput(selection)
      when "number-button" then revisedSelection = MarkdownEditingDescriptor.insertNumberInput(selection)
      when "checks-button" then revisedSelection = MarkdownEditingDescriptor.insertCheckboxChoice(selection)
      when "dropdown-button" then revisedSelection = MarkdownEditingDescriptor.insertSelect(selection)
      when "header-button" then revisedSelection = MarkdownEditingDescriptor.insertHeader(selection)
      when "explanation-button" then revisedSelection = MarkdownEditingDescriptor.insertExplanation(selection)
      else # ignore click

    if revisedSelection != null
      @markdown_editor.replaceSelection(revisedSelection)
      @markdown_editor.focus()

  ###
  Event listener for toggling cheatsheet (only possible when markdown editor is visible).
  ###
  toggleCheatsheet: (e) =>
    e.preventDefault();
    if !$(@markdown_editor.getWrapperElement()).find('.simple-editor-cheatsheet')[0]
      @cheatsheet = $($('#simple-editor-cheatsheet').html())
      $(@markdown_editor.getWrapperElement()).append(@cheatsheet)

    setTimeout (=> @cheatsheet.toggleClass('shown')), 10

  ###
  Stores the current editor and hides the one that is not displayed.
  ###
  setCurrentEditor: (editor) ->
    if @current_editor
      $(@current_editor.getWrapperElement()).hide()
    @current_editor = editor
    $(@current_editor.getWrapperElement()).show()
    $(@current_editor).focus();

  ###
  Called when save is called. Listeners are unregistered because editing the block again will
  result in a new instance of the descriptor. Note that this is NOT the case for cancel--
  when cancel is called the instance of the descriptor is reused if edit is selected again.
  ###
  save: ->
    @element.off('click', '.xml-tab', @changeEditor)
    @element.off('click', '.format-buttons a', @onToolbarButton)
    @element.off('click', '.cheatsheet-toggle', @toggleCheatsheet)
    if @current_editor == @markdown_editor
        {
            data: MarkdownEditingDescriptor.markdownToXml(@markdown_editor.getValue())
            metadata:
            	markdown: @markdown_editor.getValue()
        }
    else
       {
          data: @xml_editor.getValue()
          nullout: ['markdown']
       }

  @insertMultipleChoice: (selectedText) ->
    return MarkdownEditingDescriptor.insertGenericChoice(selectedText, '(', ')', MarkdownEditingDescriptor.multipleChoiceTemplate)

  @insertCheckboxChoice: (selectedText) ->
    return MarkdownEditingDescriptor.insertGenericChoice(selectedText, '[', ']', MarkdownEditingDescriptor.checkboxChoiceTemplate)

  @insertGenericChoice: (selectedText, choiceStart, choiceEnd, template) ->
    if selectedText.length > 0
      # Replace adjacent newlines with a single newline, strip any trailing newline
      cleanSelectedText = selectedText.replace(/\n+/g, '\n').replace(/\n$/,'')
      lines =  cleanSelectedText.split('\n')
      revisedLines = ''
      for line in lines
        revisedLines += choiceStart
        # a stand alone x before other text implies that this option is "correct"
        if /^\s*x\s+(\S)/i.test(line)
          # Remove the x and any initial whitespace as long as there's more text on the line
          line = line.replace(/^\s*x\s+(\S)/i, '$1')
          revisedLines += 'x'
        else
          revisedLines += ' '
        revisedLines += choiceEnd + ' ' + line + '\n'
      return revisedLines
    else
      return template

  @insertStringInput: (selectedText) ->
    return MarkdownEditingDescriptor.insertGenericInput(selectedText, '= ', '', MarkdownEditingDescriptor.stringInputTemplate)

  @insertNumberInput: (selectedText) ->
    return MarkdownEditingDescriptor.insertGenericInput(selectedText, '= ', '', MarkdownEditingDescriptor.numberInputTemplate)

  @insertSelect: (selectedText) ->
    return MarkdownEditingDescriptor.insertGenericInput(selectedText, '[[', ']]', MarkdownEditingDescriptor.selectTemplate)

  @insertHeader: (selectedText) ->
    return MarkdownEditingDescriptor.insertGenericInput(selectedText, '', '\n====\n', MarkdownEditingDescriptor.headerTemplate)

  @insertExplanation: (selectedText) ->
    return MarkdownEditingDescriptor.insertGenericInput(selectedText, '[explanation]\n', '\n[explanation]', MarkdownEditingDescriptor.explanationTemplate)

  @insertGenericInput: (selectedText, lineStart, lineEnd, template) ->
    if selectedText.length > 0
      # TODO: should this insert a newline afterwards?
      return lineStart + selectedText + lineEnd
    else
      return template

# We may wish to add insertHeader. Here is Tom's code.
# function makeHeader() {
#  var selection = simpleEditor.getSelection();
#  var revisedSelection = selection + '\n';
#  for(var i = 0; i < selection.length; i++) {
#revisedSelection += '=';
#  }
#  simpleEditor.replaceSelection(revisedSelection);
#}
#
  @markdownToXml: (markdown)->
    toXml = `function(markdown) {
      var xml = markdown;

      // replace headers
      xml = xml.replace(/(^.*?$)(?=\n\=\=+$)/gm, '<h1>$1</h1>');
      xml = xml.replace(/\n^\=\=+$/gm, '');

      // group multiple choice answers
      xml = xml.replace(/(^\s*\(.?\).*?$\n*)+/gm, function(match, p) {
        var groupString = '<multiplechoiceresponse>\n';
        groupString += '  <choicegroup type="MultipleChoice">\n';
        var options = match.split('\n');
        for(var i = 0; i < options.length; i++) {
          if(options[i].length > 0) {
            var value = options[i].split(/^\s*\(.?\)\s*/)[1];
            var correct = /^\s*\(x\)/i.test(options[i]);
            groupString += '    <choice correct="' + correct + '">' + value + '</choice>\n';
          }
        }
        groupString += '  </choicegroup>\n';
        groupString += '</multiplechoiceresponse>\n\n';
        return groupString;
      });


      // group check answers for MSUP

      xml = xml.replace(/(^\s*[I]:.*\n\s*[S]:.*\n\s*[+-]:.*?$\n\s*[+-]:.*?$(\s*[+-]:.*?$)*)+/gm, function(match, p) {
        var options = match.split('\n');
        var groupString = "";
        var string = "";
        var intro_reg = /^\s*[S]:.*?/;
        var item_reg = /^\s*[+-]:.*?/;

        for(var i = 0; i < options.length; i++) {

          if(intro_reg.test(options[i])) {
            groupString += options[i].split(/^\s*[S]:\s*/)[1] + '\n'
          }
          if(item_reg.test(options[i])) {
            var value = options[i].split(/^\s*[+-]:\s*/)[1];
            var correct = /^\s*\+:/i.test(options[i]);
            string += '    <choice correct="' + correct + '">' + value + '</choice>\n';
          }
        }
        groupString += '<choiceresponse>\n';
        groupString += '  <checkboxgroup direction="vertical">\n';
        groupString +=  string;
        groupString += '  </checkboxgroup>\n';
        groupString += '</choiceresponse>\n\n';
        return groupString;
      });

       // sorting answers for MSUP
      xml = xml.replace(/(^\s*[I]:.*\n\s*[S]:.*\n\s*\d*:.*?$\n(\s*\d*:.*?$)*)+/gm, function(match, p) {

        var answer = [];
        var single_answer;
        var uniq_class;
        var ms;
        Today = new Date();
        ms = Today.getTime();

        var intro_reg = /^\s*[S]:.*?/;
        var item_reg = /^\s*\d*:.*?/;

        uniq_class = "st"+ Math.floor(Math.random( )*9999999) + "_" + ms;


        var list_elements = "";
        var options = match.split('\n');
        var groupString = "";
        for(var i = 0; i < options.length; i++) {

          if(intro_reg.test(options[i])) {
             groupString = options[i].split(/^\s*[S]:\s*/)[1] + '\n';
          }

          if(item_reg.test(options[i])) {
            var text = options[i].split(/^\s*\d*:\s*/)[1];
            single_answer = options[i].split(':')[0];
            answer.push(String(single_answer-1));
            list_elements += '    <li>' + text + '<textline hidden = "1" correct_answer = "'+single_answer+'" /></li>\n';
          }
        }
        answer = JSON.stringify(answer);
        //alert (answer);
        groupString +=  '<script type="loncapa/python">\n';
        groupString += 'def sorting_check_' + uniq_class + '(expect, ans):\n';
        groupString += '   try:\n';
        groupString += '      return expect == ans\n';
        groupString += '   except ValueError:\n';
        groupString += '      return False\n';
        groupString += 'def sorting_' + uniq_class + '(expect, ans):\n';
        groupString += '   return sorting_check_' + uniq_class + '(';
        groupString +=  answer;
        groupString += ', ans)\n';
        groupString += '</script>\n';

        groupString += '<customresponse cfn="sorting_' + uniq_class + '">\n';
        groupString += '   <ul class = "sorting '+uniq_class+'"> \n';
        groupString += list_elements;
        groupString += '  </ul>\n';
        groupString += '</customresponse>\n\n';
        //groupString += '<script type = "text/javascript">\n';
        //groupString += 'var uniq_class = '+uniq_class+';\n';
        //groupString += '</script>\n';
        //
        groupString += '<script type = "text/javascript">\n';
        groupString += "$('ul.sorting." + uniq_class + "').each(function () {var selectedValue = $('ul.sorting." + uniq_class + "').val(); $(this).html($('li', $(this)).sort(function (a, b) {var arel = parseInt($(a).children('section').children('div').children('input').attr('value'));var brel = parseInt($(b).children('section').children('div').children('input').attr('value'));return arel == brel ? 0 : arel != Math.max(arel,brel) ? -1 : 1}));$(this).val(selectedValue);});\n";
        groupString += ' function enumerate_' + uniq_class + '() {\n';
        groupString += '    $(\'ul.sorting.'+uniq_class+' input\').each(function (i, elem) {\n';
        groupString += '       $(elem).val(i);\n';
        groupString += '    });\n';
        groupString += ' };\n\n';
        groupString += ' enumerate_' + uniq_class + '();\n';

        groupString += ' $(".sorting.'+uniq_class+'").sortable({\n';
        groupString += '    placeholder: "ui-state-highlight",';
        groupString += '    stop: function (event, ui) {\n';
        groupString += '       enumerate_' + uniq_class + '();\n';
        groupString += '    }\n';
        groupString += ' });\n';

        groupString += ' $(".sorting.'+uniq_class+'").disableSelection();\n';

        groupString += '</script>\n';


        return groupString;
      });



      // LR-question for MSUP
      xml = xml.replace(/(^\s*[I]:.*?$\n\s*[S]:.*?$\n\s*[LR]\d*:.*?$\n(\s*[LR]\d*:.*?$)*)+/gm, function(match, p) {

        var answer = [];
        var single_answer;
        var uniq_class;
        var ms;
        var llist = "";
        var rlist = "";
        var lvalues = [];
        var rvalues = [];
        Today = new Date();
        ms = Today.getTime();

        uniq_class = "lr"+ Math.floor(Math.random( )*9999999) + "_" + ms;


        var list_elements = "";
        var options = match.split('\n');
        var groupString = "";
        //var groupString = options[1] + '\n';
        var l_iterator = 0;
        var r_iterator = 0;
        var intro_reg = /^\s*[S]:.*?/;
        var l_reg = /^\s*[L]\d*:.*?/;
        var r_reg = /^\s*[R]\d*:.*?/;


        for(var i = 0; i < options.length; i++) {
          if(intro_reg.test(options[i])) {
            groupString = options[i].split(/^\s*[S]:\s*/)[1] + '\n';
          }

          if(l_reg.test(options[i])) {

            lvalues[l_iterator] = [];
            lvalues[l_iterator]["text"] = options[i].split(/^\s*[L]\d*:\s*/)[1];
            lvalues[l_iterator]["value"] = options[i].split(/^\s*[L]/)[1].split(":")[0];

            llist += '<li rel = "'+l_iterator+'">' + lvalues[l_iterator]["text"] + '</li>\n';
            //groupString += lvalues[l_iterator]["value"] + '\n';
            l_iterator++;

          }
        }

        var correct_answer;
        for(var i = 0; i < options.length; i++) {
          if(r_reg.test(options[i])) {

            rvalues[r_iterator] = [];
            rvalues[r_iterator]["text"] = options[i].split(/^\s*[R]\d*:\s*/)[1];
            rvalues[r_iterator]["value"] = options[i].split(/^\s*[R]/)[1].split(":")[0];
            rvalues[r_iterator]["answer"] = [];
            rvalues[r_iterator]["answer_text"] = [];
            for (var j = 0; j < lvalues.length; j++){
                if (lvalues[j]["value"]==rvalues[r_iterator]["value"]){
                    rvalues[r_iterator]["answer"].push(j);
                    rvalues[r_iterator]["answer_text"].push(lvalues[j]["text"]);
                }
            }

            //groupString += rvalues[r_iterator]["text"] + '\n';
            //groupString += rvalues[r_iterator]["value"] + '\n';
            //groupString += rvalues[r_iterator]["answer"] + '\n';
            //correct_answer = String(rvalues[r_iterator]["answer"]+1);
            rlist += '<li>' + rvalues[r_iterator]["text"] + '<textline hidden = "1" size = "2" correct_answer = "' + rvalues[r_iterator]["answer_text"]  + '" /><ul class = "receiver '+uniq_class+'"></ul></li>\n';
            answer.push(JSON.stringify(rvalues[r_iterator]["answer"]));
            r_iterator++;

          }
        }

        answer = JSON.stringify(answer);
        //alert (answer);
        groupString += '<script type="loncapa/python">\n';
        groupString += 'def sort_list_' + uniq_class + '(input_array):\n';
        groupString += '   output_array = [] \n';
        groupString += '   for element in input_array: \n';
        groupString += '       output_array.append(sorted(eval(element)))\n';
        groupString += '   return output_array  \n';

        groupString += 'def check_lr_question_' + uniq_class + '(expect, ans):\n';
        groupString += '   correct = '+answer+'\n';
        groupString += '   answ = []\n';
        groupString += '   if isinstance (ans, list):\n';
        groupString += '       answ = ans\n';
        groupString += '   else:\n';
        groupString += '       answ.append(ans)\n';
        groupString += '   answ = sort_list_' + uniq_class + '(answ)\n';
        groupString += '   correct = sort_list_' + uniq_class + '(correct)\n';
        groupString += '   try:\n';
        groupString += '      return correct == answ\n';
        groupString += '   except ValueError:\n';
        groupString += '      return False\n';
        groupString += '</script>\n';

        groupString += '<customresponse cfn="check_lr_question_' + uniq_class + '">\n';
        groupString += '  <table class = "lr-question" width = "100%">\n';
        groupString += '  <tr>\n';
        groupString += '  <td width = "50%">\n';
        groupString += '  <ul id = "host" class = "'+uniq_class+'">\n';
        groupString +=  llist;
        groupString += '  </ul>\n';
        groupString += '  </td>\n';
        groupString += '  <td>\n';
        groupString += '  <ul class = "boxes">\n';
        groupString +=  rlist;
        groupString += '  </ul>\n';
        groupString += '  </td>\n';
        groupString += '  </tr>\n';
        groupString += '  </table>\n';
        groupString += '</customresponse>\n\n';
        groupString += '<script type = "text/javascript">\n';
        groupString += 'function initialize_'+uniq_class+'(arr){$(".receiver.'+uniq_class+'").each(function(){self = this; var input_values = $(self).prev().children("div").children("input").attr("value"); if (input_values) {input_values = JSON.parse(input_values);}else{$(self).prev().children("div").children("input").val("[]");} for(var i =0; i + 1 == Math.min(i+1,input_values.length);i++){ $("<li rel = " + input_values[i] + ">"+arr[input_values[i]]+"</li>").appendTo($(self));}; });}\n\n';
        //groupString += 'var uniq_class = '+uniq_class+';\n';
        groupString += 'var init_arr = [];\n';
        groupString += '$("#host.'+uniq_class+' li").each(function(){ init_arr[parseInt($(this).attr("rel"))] = $(this).text();});\n\n';
        groupString += 'initialize_'+uniq_class+'(init_arr);\n\n';
        groupString += 'function clean_array_'+uniq_class+'(arr){arr = jQuery.grep(arr, function(n, i){return (n !== ""); });arr = jQuery.unique(arr);return arr;}\n\n';
        groupString += 'function json_into_input_'+uniq_class+'(self){var example = $(self).sortable("toArray", {attribute: "rel" }); example = clean_array_'+uniq_class+'(example); example = example.sort(); for(var i = 0; i+1 == Math.min(i+1, example.length); i++){ example[i] = parseInt(example[i], 10); } if (Math.min(example.length, 1) == 1) { json_value = JSON.stringify(example); }else{ json_value = "[]"; }  $(self).prev().children("div").children("input").val(json_value);}\n\n';
        groupString += 'removeIntent = false;\n\n';
        groupString += '$(".receiver.'+uniq_class+'").sortable({connectWith: ".receiver.'+uniq_class+'", opacity:0.8, placeholder: "ui-state-highlight",update: function () {json_into_input_'+uniq_class+'(this);},over: function () {removeIntent = false;}, out: function () {removeIntent = true;}, beforeStop: function (event, ui) { if (removeIntent === true) { ui.item.remove(); json_into_input_'+uniq_class+'(this); } }});\n\n';
        groupString += '$("#host.'+uniq_class+' li").draggable({ connectToSortable: ".receiver.'+uniq_class+'",helper: "clone", opacity:0.8, revert: "invalid"});\n\n';

        groupString += '</script>\n';


        return groupString;
      });


      // group check answers
      xml = xml.replace(/(^\s*\[.?\].*?$\n*)+/gm, function(match, p) {
        var groupString = '<choiceresponse>\n';
        groupString += '  <checkboxgroup direction="vertical">\n';
        var options = match.split('\n');
        for(var i = 0; i < options.length; i++) {
          if(options[i].length > 0) {
            var value = options[i].split(/^\s*\[.?\]\s*/)[1];
            var correct = /^\s*\[x\]/i.test(options[i]);
            groupString += '    <choice correct="' + correct + '">' + value + '</choice>\n';
          }
        }
        groupString += '  </checkboxgroup>\n';
        groupString += '</choiceresponse>\n\n';
        return groupString;
      });

      // textbox
      xml = xml.replace(/^\:===/gm, function(match, p) {
         var string;
         string = '<customresponse>\n';
         string += '  <textbox/>\n';
         string += '</customresponse>\n';

        return string;
      });

      //(\s*[I]:.*\n\s*[S]:.*\n\s*[+]:.*?$)(?!(\n\s*[+-]:.*?$))
      // replace string and numerical for msup
      xml = xml.replace(/^(\s*[I]:.*?$\n\s*[S]:.*?$\n\s*[+]:.*?$)(?!(\n\s*[+-]:.*?$))/gm, function(match, p) {
        var string = "";
        var options = match.split('\n');
        var intro_reg = /^\s*[S]:.*?/;
        var item_reg = /^\s*[+]:.*?/;

        for(var i = 0; i < options.length; i++) {

          if(intro_reg.test(options[i])) {
             string += options[i].split(/^\s*[S]:\s*/)[1] + '\n';
          }

          if(item_reg.test(options[i])) {
             var answer = options[i].split(/^\s*[+]:\s*/)[1];
          }
        }

        var floatValue = parseFloat(answer);
        if(!isNaN(floatValue)) {
          var params = /(.*?)\+\-\s*(.*?$)/.exec(answer);
          if(params) {
            string += '<numericalresponse answer="' + floatValue + '">\n';
            string += '  <responseparam type="tolerance" default="' + params[2] + '" />\n';
          } else {
            string += '<numericalresponse answer="' + floatValue + '">\n';
          }
          string += '  <textline />\n';
          string += '</numericalresponse>\n\n';
        } else {
          string += '<stringresponse answer="' + answer + '" type="ci">\n  <textline size="20"/>\n</stringresponse>\n\n';
        }
        return string;
      });

      // replace string and numerical
      xml = xml.replace(/(^\=\s*(.*?$)(\n*or\=\s*(.*?$))*)+/gm, function(match, p) {
        var string,
            answersList = p.replace(/^(or)?=\s*/gm, '').split('\n'),
            floatValue = parseFloat(answersList[0]);

        if(!isNaN(floatValue)) {
          var params = /(.*?)\+\-\s*(.*?$)/.exec(answersList[0]);
          if(params) {
            string = '<numericalresponse answer="' + floatValue + '">\n';
            string += '  <responseparam type="tolerance" default="' + params[2] + '" />\n';
          } else {
            string = '<numericalresponse answer="' + floatValue + '">\n';
          }
          string += '  <formulaequationinput />\n';
          string += '</numericalresponse>\n\n';
        } else {
            var answers = [];

            for(var i = 0; i < answersList.length; i++) {
                answers.push(answersList[i])
            }

            string = '<stringresponse answer="' + answers.join('_or_') + '" type="ci">\n  <textline size="20"/>\n</stringresponse>\n\n';
        }
        return string;
    });

      // replace selects
      xml = xml.replace(/\[\[(.+?)\]\]/g, function(match, p) {
        var selectString = '\n<optionresponse>\n';
        selectString += '  <optioninput options="(';
        var options = p.split(/\,\s*/g);
        for(var i = 0; i < options.length; i++) {
          selectString += "'" + options[i].replace(/(?:^|,)\s*\((.*?)\)\s*(?:$|,)/g, '$1') + "'" + (i < options.length -1 ? ',' : '');
        }
        selectString += ')" correct="';
        var correct = /(?:^|,)\s*\((.*?)\)\s*(?:$|,)/g.exec(p);
        if (correct) selectString += correct[1];
        selectString += '"></optioninput>\n';
        selectString += '</optionresponse>\n\n';
        return selectString;
      });

      // replace explanations
      xml = xml.replace(/\[explanation\]\n?([^\]]*)\[\/?explanation\]/gmi, function(match, p1) {
          var selectString = '<solution>\n<div class="detailed-solution">\nExplanation\n\n' + p1 + '\n</div>\n</solution>';
          return selectString;
      });
      // replace advices
      xml = xml.replace(/\[advice.*?\]\n?([^\]]*)\[\/?advice\]/gmi, function(match, p1) {
          var options = match.split('\n');
          var inside_text_reg = /\[\/?advice.*?\]/gmi;

          var inside_text = match.split(inside_text_reg);

          var delay_string;
          var delay_reg = /delay\s*=\s*\"?\'?/;
          var delay_reg_right = /\"?\'?\]/;
          var delay = 0;
          if (delay_reg.test(options[0])){
              delay_string = options[0].split(delay_reg)[1];
              if (delay_reg_right.test(delay_string)){
                  delay = delay_string.split(/\"?\'?\]/)[0];
              };
          };
          var uniq_rel = 1 + Math.floor(Math.random() * 9999999);
          var selectString = '\n<div class="advice-for-problem" rel = "' + delay + '">\n<span class ="title" rel = "'+uniq_rel+'">Advice</span>\n<div class = "inner">\n' + inside_text[1] + '\n</div>\n</div>\n';
      });
      // replace code blocks
      xml = xml.replace(/\[code\]\n?([^\]]*)\[\/?code\]/gmi, function(match, p1) {
          var selectString = '<pre><code>\n' + p1 + '</code></pre>';
          return selectString;
      });

      // split scripts and preformatted sections, and wrap paragraphs
      var splits = xml.split(/(\<\/?(?:script|pre).*?\>)/g);
      var scriptFlag = false;
      for(var i = 0; i < splits.length; i++) {
        if(/\<(script|pre)/.test(splits[i])) {
          scriptFlag = true;
        }
        if(!scriptFlag) {
          splits[i] = splits[i].replace(/(^(?!\s*\<|$).*$)/gm, '<p>$1</p>');
        }
        if(/\<\/(script|pre)/.test(splits[i])) {
          scriptFlag = false;
        }
      }
      xml = splits.join('');

      // rid white space
      xml = xml.replace(/\n\n\n/g, '\n');

      // surround w/ problem tag
      xml = '<problem>\n' + xml + '\n</problem>';

      return xml;
    }
    `
    return toXml markdown

