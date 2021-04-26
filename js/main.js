const search = document.getElementById("active-search");
const hidePlaylists = document.getElementById("lists");
const hideYtplaylist = document.getElementById("result-list");
const comingSoon = document.querySelector(".notes");



//BACKGROUND COLOR CHANGE
$('label').on("click", function() {
    $index = $(this).prevAll().length;

    if ($index === 1) {
        $('body').css('background-image', 'radial-gradient(circle farthest-corner at 10% 20%, #E43397 0%, #00C4CC 100.2%)');

        search.style.display = "none";
        hidePlaylists.style.display = "block";
        hideYtplaylist.style.display = "none";
        comingSoon.style.display = "none";

    } else if ($index === 3) {
        $('body').css('background', '#c988f8');

        search.style.display = "block";
        hidePlaylists.style.display = "none";
        hideYtplaylist.style.display = "block";
        comingSoon.style.display = "none";

    } else if ($index === 5) {
        $('body').css('background', '#7ce2dd');
        hidePlaylists.style.display = "none";
        hideYtplaylist.style.display = "none";
        search.style.display = "none";
        comingSoon.style.display = "block";
        comingSoon.style.color = "#00c4cc";



    } else {
        $('body').css('background', '#E43397');
        comingSoon.style.display = "block";
        comingSoon.style.color = "pink";
    }
});


// MAKING NAV-BAR FUNCTIONING