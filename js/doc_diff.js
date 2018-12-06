// TODO: Instead of removing the button, empty the content may enable the undo for buttons as well.
// TODO: Adding support to special character, such as newline.

/**
 * Class
 * @constructor
 */

 var doc_diff = function() {

 };

 /**
 * Find the differences between two texts.
 * @param {string} v1 Old string to be diffed.
 * @param {string} v2 New string to be diffed.
 * @return {string} diff the comparison of two versions with the difference highlighted if in v1, buttoned if in v2.
 */
 doc_diff.prototype.diff_main = function(v1, v2) {
     // check for null inputs
     if (v1 == null || v2 == null) {
         throw new Error('Null input. (diff_main)');
     }

     // check for equality
     if (v1 == v2) {
         return v1;
     }

     var m = v1.length;
     var n = v2.length;

     var result = [];
     for (var i = 0; i <= m; i++) {
         result.push([]);
         for (var j = 0; j <= n; j++) {
             if (i == 0 || j == 0) {
                 curr = 0;
             } else if (v1.charAt(i - 1) == v2.charAt(j - 1)) {
                 curr = result[i - 1][j - 1] + 1;
             } else {
                 curr = Math.max(result[i][j - 1], result[i - 1][j]);
             }
             result[i].push(curr);
         }
     }

     var combine = '';
     var v1CloseTag = false;
     var v2CloseTag = false;
     var i = m;
     var j = n;
     var bid = 0;
     var sid = 0;

     // make sure the span and the button tags are in pair
     while (i > 0 && j > 0) {
         if (v1.charAt(i - 1) == v2.charAt(j - 1)) {
             if (v1CloseTag) {
                 sid++;
                 combine = '<span id="s' + sid + '" style="background-color:lightblue" contentEditable="true">' + combine;
                 // pair up with an empty button
                 bid++;
                 var arg = "'b" + bid + "', 's" + sid + "'"; // 'b1', 's1'

                 var str_del = combine.substring(combine.indexOf('>') + 1, combine.indexOf('</span'));
                 combine = '<button id="b' + bid + '" ondblclick="update(' + arg + ')" type="button" class="button v2"><del>' + str_del + '</del></button>' + combine;
                 v1CloseTag = false;
             } else if (v2CloseTag) {
                 bid++;
                 var arg = "'b" + bid + "', 's" + sid + "'"; // 'b1', 's1'
                 combine = '<button id="b' + bid + '" ondblclick="update(' + arg + ')" type="button" class="button v2">' + combine;

                 v2CloseTag = false;
             }
             if (v1.charAt(i - 1) == ' ') {
              combine = '&nbsp' + combine;
             } else {
              combine = v1.charAt(i - 1) + combine;
             }

             i--;
             j--;
         } else if (result[i][j - 1] > result[i - 1][j]) {
             if (v1CloseTag) {
                 sid++;
                 combine = '<span id="s' + sid + '" style="background-color:lightblue" contentEditable="true">' + combine;
                 combine = '</button>' + combine;
                 v2CloseTag = true;
                 v1CloseTag = false;
             }
             if (!v1CloseTag && !v2CloseTag) {
                 if (bid == sid) { // empty placeholder
                   sid++;
                   combine = '<span id="s' + sid + '" style="background-color:lightblue" contentEditable="true"></span>' + combine;
                 }
                 combine = '</button>' + combine;
                 v2CloseTag = true;
             }

             if (v2.charAt(j - 1) == ' ') {
              combine = '&nbsp' + combine;
             } else {
              combine = v2.charAt(j - 1) + combine;
             }

             j--;
         } else {
             if (!v1CloseTag) {
                 combine = '</span>' + combine;
                 v1CloseTag = true;
             }
             if (v1.charAt(i - 1) == ' ') {
              combine = '&nbsp' + combine;
             } else {
              combine = v1.charAt(i - 1) + combine;
             }
             i--;
         }
     }

     if (v1CloseTag) {
         sid++;
         combine = '<span id="s' + sid + '" style="background-color:lightblue" contentEditable="true">' + combine;
         bid++;
         var arg = "'b" + bid + "', 's" + sid + "'"; // 'b1', 's1'

         var str_del = combine.substring(combine.indexOf('>') + 1, combine.indexOf('</span'));
         combine = '<button id="b' + bid + '" ondblclick="update(' + arg + ')" type="button" class="button v2"><del>' + str_del + '</del></button>' + combine;
     }
     if (i != 0) {
       combine = '</span>' + combine;
       combine = v1.substring(0, i) + combine;
       sid++;
       combine = '<span id="s' + sid + '" style="background-color:lightblue" contentEditable="true">' + combine;
       bid++;
       var arg = "'b" + bid + "', 's" + sid + "'"; // 'b1', 's1'

       var str_del = combine.substring(combine.indexOf('>') + 1, combine.indexOf('</span'));
       combine = '<button id="b' + bid + '" ondblclick="update(' + arg + ')" type="button" class="button v2"><del>' + str_del + '</del></button>' + combine;
     }
     if (j != 0) {
       if (bid == sid) { // empty placeholder
         sid++;
         combine = '<span id="s' + sid + '" style="background-color:lightblue" contentEditable="true"></span>' + combine;
       }
       combine = '</button>' + combine;
       combine = v2.substring(0, j) + combine;
       bid++;
       var arg = "'b" + bid + "', 's" + sid + "'"; // 'b1', 's1'
       combine = '<button id="b' + bid + '" ondblclick="update(' + arg + ')" type="button" class="button v2">' + combine;
     }

     return combine;

 };

 doc_diff.prototype.applyChanges = function(raw) {
  result = '';
  var start = 0, end = 0;
  var keeps = [];

  while ((end = raw.indexOf('<button', start)) != -1) {
   var range = [];
   range.push(start);
   range.push(end);
   keeps.push(range);
   start = raw.indexOf('</button>', end) + '</button>'.length;
  }

  if (start != raw.length) {
   var range = [];
   range.push(start);
   range.push(raw.length);
   keeps.push(range);
  }

  for (var i = 0; i < keeps.length; i++) {
   result += raw.substr(keeps[i][0], keeps[i][1] - keeps[i][0]);
  }
  console.log(result);

  return result;

 };

 this['doc_diff'] = doc_diff;