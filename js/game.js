// Guessing Game
var numGuesses = 7;
var prevGuesses = [];
var theNumber;
var $guessVal = $('.fn-guess-input').val();

var options = {
  hottest: "ON FIRE! VERY CLOSE!",
  hot: "Ooh ooh hot!",
  warm: "You're warm..",
  cool: "Ooh, cool..",
  cold: "Aw, you're cold..",
  coldest: "AHH. VERY. COLD.",
  higher: "<br>trying going higher <span class='glyphicon glyphicon-arrow-up'></span>",
  lower: "<br>try going lower <span class='glyphicon glyphicon-arrow-down'></span>",
  win: "Congrats! You got it!"
};

$(document).ready(function(){
  newGameState();
});

function generateNumber() {
  theNumber = Math.floor(Math.random() * 100 + 1);
}

function newGameState() {
  generateNumber();
  // store new number on button for popover reveal
  $('.fn-hint-btn').attr("data-content", theNumber);
  $('.fn-guess-input').focus();
  // hide alerts for replays
  $('.fn-guess-alerts').children().slideUp('slow');
}

function guess() {
  $guessVal = $('.fn-guess-input').val();
  var regNum = new RegExp('^\\d+$'); // only numbers
  // invalid submissions
  if ($guessVal === '' || $guessVal > 100 || $guessVal < 1 || !regNum.test($guessVal)) {
    $('.fn-guess-input').popover({
      container: 'body',
      trigger: 'manual',
      title: 'Try again',
      content: "Please enter a number from 1 - 100."
    });
    // show invalid entry popover
    $('.fn-guess-input').popover('show');
  }
  else if (numGuesses > 0) {
    $('.fn-guess-input').popover('hide');
    $('.fn-sink').slideDown('slow'); // div containing prev guesses
    $('.fn-print-guess').text($guessVal);

    // cur guessVal not present, push to guess arr
    if (prevGuesses.indexOf($guessVal) === -1) {
      prevGuesses.push($guessVal);
      numGuesses--;
      updateNumGuesses();
      displayPrevGuesses(prevGuesses);
      alerts(); // hot/cold alerts + math computations
    } else {
      $('.fn-warn-alert').html("You've already tried: " + $guessVal + "<br>Please try again.").slideDown('slow').siblings().slideUp('slow');
    }
  }
  // clear input field for next guess
  $('.fn-guess-input').focus().val('');
}

function highOrLow() {
  if (theNumber > $guessVal) {
    return options.higher;
  }
  else if (theNumber < $guessVal) {
    return options.lower;
  }
}

function alerts() {
  var guessDiff = Math.abs(theNumber - $guessVal);
  var $lastGuess = $('#fn-num-guesses > span:last'); // to apply color styles
  if (guessDiff === 0) { // win case
    $lastGuess.addClass('win');
    $('.fn-win-alert').html(options.win).slideDown('slow').siblings().slideUp('slow');
    $('.fn-guess-btn').attr('disabled', 'disabled');
    $('.fn-win-modal').modal('show');
  }
  else if (guessDiff <= 5) {
    $('.fn-hot-alert').html(options.hottest + highOrLow($guessVal)).slideDown('slow').siblings().slideUp('slow');
    $lastGuess.addClass('hottest');
  }
  else if (guessDiff <= 10) {
    $('.fn-hot-alert').html(options.hot + highOrLow($guessVal)).slideDown('slow').siblings().slideUp('slow');
    $lastGuess.addClass('hot');
  }
  else if (guessDiff <= 15) {
    $('.fn-hot-alert').html(options.warm + highOrLow($guessVal)).slideDown('slow').siblings().slideUp('slow');
    $lastGuess.addClass('warm');
  }
  else if (guessDiff <= 20) {
    $('.fn-cold-alert').html(options.cool + highOrLow($guessVal)).slideDown('slow').siblings().slideUp('slow');
    $lastGuess.addClass('cool');
  }
  else if (guessDiff <= 25) {
    $('.fn-cold-alert').html(options.cold + highOrLow($guessVal)).slideDown('slow').siblings().slideUp('slow');
    $lastGuess.addClass('cold');
  }
  else if (guessDiff >= 26) {
    $('.fn-cold-alert').html(options.coldest + highOrLow($guessVal)).slideDown('slow').siblings().slideUp('slow');
    $lastGuess.addClass('coldest');
  }
}

function updateNumGuesses() {
  $('.fn-num-guesses').text(numGuesses + ' left');
  if (numGuesses === 0) {
    $('.fn-guess-btn').attr('disabled', 'disabled');
    if ($guessVal != theNumber) {
      $('.fn-lose-modal').modal('show');
    }
  }
}

function displayPrevGuesses(prevGuesses) {
  var guessUp = '<span>' + prevGuesses[prevGuesses.length - 1] + '<span class="glyphicon glyphicon-arrow-up"></span></span>';
  var guessDown = '<span>' + prevGuesses[prevGuesses.length - 1] + '<span class="glyphicon glyphicon-arrow-down"></span></span>';

  if (prevGuesses[prevGuesses.length - 1] < theNumber) {
    if (prevGuesses.length == 1) {
      $('#fn-num-guesses').empty();
      $('#fn-num-guesses').append('Previous Guesses: ' + guessUp);
    } else {
      $('#fn-num-guesses').append(', ' + guessUp);
    }
  }
  else if (prevGuesses[prevGuesses.length - 1] > theNumber) {
    if (prevGuesses.length == 1) {
      $('#fn-num-guesses').empty();
      $('#fn-num-guesses').append('Previous Guesses: ' + guessDown);
    } else {
      $('#fn-num-guesses').append(', ' + guessDown);
    }
  }
  else if (prevGuesses[prevGuesses.length - 1] == theNumber) {
    if (prevGuesses.length == 1) {
     $('#fn-num-guesses').empty();
     $('#fn-num-guesses').append('Wow, first try! ' + 'You won with: <span>' + theNumber + '</span>');
    } else {
      $('#fn-num-guesses').append(', ' + '<span>' + prevGuesses[prevGuesses.length - 1] + '</span>');
      }
  }
  // the appending and emptying of the guesses div could maybe be abstracted
}

function playAgain() {
  newGameState();
  prevGuesses = [];
  numGuesses = 7;
  updateNumGuesses();
  $('.fn-guess-input').val(''); // clear input field
  $('#fn-num-guesses').html('Your game has been restarted. <br>Submit a new guess!');
  $('.fn-print-guess').text('?'); // replace number in circle with '?'
  $('.fn-guess-btn').removeAttr('disabled'); // unfreeze guess btn
}

// display hint popover with click or focus
$('.fn-hint-btn').popover({trigger: 'click, focus'});
// submit guess by clicking Guess or pressing enter
$('.fn-guess-btn').on('click', guess);
$('.fn-guess-input').keypress(function(e) {
    if (e.which == 13) {
        guess();
    }
});
// play again button
$('.fn-play-again-btn').on('click', playAgain);