/*
made by Morten Byhring (mbyhring at gmail com)
Splits up a long form / text into a "wizard".
Usage: $("yourform").formwizard();
Divide your form markup into logical parts (steps) with elements having a class="step"
- use a heading h3 for the text which should show in the wizards steps.
  example:
      <form>
            <div class="step">
                <h3>Personalia:</h3>
                name: <input type="text">
                age: <input type="text">
                country; <input type="text">
            </div>
            <div class="step">
                <h3>Interests:</h3>
                <input type="checkbox" value="java" />
                <input type="checkbox" value="python" />
                <input type="checkbox" value="jquery" />
            </div>
      </form>
 */
(function($) {
   //shell for the plugin:
   $.fn.formwizard = function() {
       return this.each(function() {
        $(this).prepend("<div id='wizard'></div>");
        $(this).find("h3").each(function() {
            $("#wizard").append("<div class='wizardStep active'>" + $(this).text() + '</div>');
        });
        $(this).find(".step").not(":first").append("<a class='prev' href='#'> Forrige</a>");
        $(this).find(".step").not(":last").append("<a class='next' href='#'> Neste</a>");
        $(this).find(".step").not(":first").hide();
        $("#wizard .wizardStep").not(":first").toggleClass("active");

        $("a.next").click(function() {
            $(this).parent().hide().next().show();
            $("#wizard .active").toggleClass("active").next().toggleClass("active");
            return false;
        });
        $("a.prev").click(function() {
            $(this).parent().hide().prev().show();
            $("#wizard .active").toggleClass("active").prev().toggleClass("active");
            return false;
        })
       });
   }
})(jQuery);
