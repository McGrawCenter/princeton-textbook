# Princeton Textbook

A Wordpress plugin that adds text, checkbox, radio button, and textarea fields for the creation of online textbooks/workbooks.

## Shortcodes

[text]

attributes:

- size (size='10')
- answer (answer='the correct answer')
- gloss (gloss='this will appear in a popup')
- inline (inline='1')
- placeholder
 
[sentence]

 size (size='10')
 answer (answer='the correct answer')
 gloss (gloss='this will appear in a popup')
 inline (inline='1')
 placeholder

[textarea]

  width (width='20px')
  height (width='20px')
  placeholder
  answer

With the following, the correct answer is indicated with a + sign

[radio]<br/>
*Option 1<br/>
*Option 2<br/>
+Option 3<br/>
[/radio]

[dropdown]<br/>
*Option 1<br/>
*Option 2<br/>
+Option 3<br/>
[/dropdown]

[checkbox] A single checkbox


[radio]*Option 1 *Option 2 +Option 3[/radio]

[dropdown]*Option 1 *Option 2 +Option 3[/dropdown]

