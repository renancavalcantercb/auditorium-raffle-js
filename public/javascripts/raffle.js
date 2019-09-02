var animationId, pos = 0;
var rowsCount = { // room configuration
    A: 12,
    B: 18,
    C: 18,
    D: 18,
    E: 18,
    F: 18,
    G: 18,
    H: 18,
    I: 18,
    J: 18,
    K: 18
};

/* ============================================================ */
/* ========== winner display animation configuration ========== */
/* ============================================================ */

// Wrap every letter in a span
var textWrapper = $('.ml16');
textWrapper.html(textWrapper.text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
// synchronise successive animations with timeline
var animation = anime.timeline({loop: true})
    .add({
        targets: '.ml16 .letter',
        translateY: [-100,0],
        easing: "easeOutExpo",
        duration: 1400,
        delay: function(el, i) {
            return 30 * i;
        }
    }).add({
        targets: '.ml16',
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 1000
    });
var winnerDisplayElement = $('h4');

/* ============================================================ */
/* ========== raffle animations functions ===================== */
/* ============================================================ */

/* Create the template for raffle container */
function createRaffleContainer() {
    var container = $('#animation-container');
    var header = "";
    var content = "";

    // container header
    header += '<div class="header"><div class="empty-seat"></div>';
    var maxNumberOfSeats = findLongestRow(rowsCount);
    for(var i=1; i<=maxNumberOfSeats; i++){
        header += '<div class="row-number">' + i + '</div>'
    }
    header += '</div>';

    // container body
    for(var row in rowsCount){
        content += '<div class="row"><div class="row-letter">' + row + '</div>';
        for(i=0; i<rowsCount[row]; i++){
            if(row === 'K' && (i === 11 || i === 12))
                content += '<div class="empty-seat"></div>';
            else
                content += '<div class="seat"><i class="material-icons">event_seat</i></div>'
        }
        content += '</div>';
    }
    container.html(header + content);
}

/* Discover the highest number of seats in a single row */
function findLongestRow(rows){
    var maxNumberOfSeats = 0;
    for(var row in rows){
        if(rows.hasOwnProperty(row)) {
            if (rows[row] > maxNumberOfSeats)
                maxNumberOfSeats = rows[row];
        }
    }
    return maxNumberOfSeats;
}

/* starts raffle animation */
function startRaffle() {
    // hide previous winner
    winnerDisplayElement.css('display', 'none');
    // start raffle animation
    animationId = setInterval(raffleAnimation, 100);
    // animation lasts for 5 sec
    setTimeout(function(){
        stopRaffle(animationId);
    }, 2500);
}

/* executed each 0.1 sec */
function raffleAnimation() {
    var seats = $('.material-icons');
    seats.removeClass('selected');
    pos = Math.floor(Math.random()*seats.length);
    seats[pos].classList.add('selected');
}

/* stops raffle animation */
function stopRaffle(animationId) {
    // stop animation
    clearInterval(animationId);
    // find winner of raffle
    var seat = findWinnerSeat(pos);
    // configure winner display element
    configWinnerDisplayElement(seat);
}

/* get information about the winner seat */
function findWinnerSeat(pos) {
    var result = {};
    for(var row in rowsCount){
        pos = pos - rowsCount[row];
        if(pos < 0){
            result[row] = rowsCount[row] + pos +1;
            return result;
        }
    }
    return result;
}

/* configure the winner display element */
function configWinnerDisplayElement(seat) {
    // find information of the seat
    var seatRow = Object.keys(seat)[0];
    var seatNumber = seat[Object.keys(seat)[0]].toString();
    // append information of the seat to winner element text
    var winnerDisplayLetters = $('.letter');
    winnerDisplayLetters[0].textContent = seatRow;
    winnerDisplayLetters[1].textContent = seatNumber.slice(0,1);
    // if there's a second digit, append it
    if(seatNumber.slice(1) !== ''){
        winnerDisplayLetters[2].classList.remove('hide');
        winnerDisplayLetters[2].textContent = seatNumber.slice(1);
    }
    // otherwise, hide element
    else{
        winnerDisplayLetters[2].classList.add('hide');
    }
    // restart animation and show new winner
    animation.restart();
    winnerDisplayElement.css('display', 'block');
}

// start the raffle when button is clicked
$('#raffle-button').on('click', startRaffle);

// create the raffle container when application starts
createRaffleContainer();
