// current date/time
// stack overflow URL https://stackoverflow.com/questions/28689524/show-real-time-date-day-of-the-week-in-javascript-or-jquery/28689891
$(document).ready(function() {
    var interval = setInterval(function(){
        var momentNow = moment();
        $("#date-part").html(momentNow.format("dddd").substring(0,8).toUpperCase() + "  " + momentNow.format("MMMM DD YYYY"));
        $("#time-part").html(momentNow.format("hh:mm:ssa"));
    }, 100);
});