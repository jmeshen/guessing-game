var numGuesses = 7;
var prevGuesses = [];
var theNumber;

var options = {
  hottest: "ON FIRE! VERY CLOSE!",
  hot: "Ooh ooh hot!",
  warm: "Ahh, you're getting warm..",
  cool: "Hrmm.. a cold breeze is upon us.",
  cold: "Brrrrr, cold!",
  coldest: "VERY COLD. NEARLY FROZEN.",
  higher: "<br>trying going higher <span class='glyphicon glyphicon-arrow-up'></span>",
  lower: "<br>try going lower <span class='glyphicon glyphicon-arrow-down'></span>",
  win: "Congrats! You got it!"
};

$(document).ready(function(){
  newGameState();

  // $('.fn-guess-input').keyup(checkInput);
});



function generateNumber() {
  theNumber = Math.floor(Math.random() * 100 + 1);
}

// function checkInput() {
//   if ($guessVal === '' || $guessVal > 100 || $guessVal < 1) {
//     $('.fn-guess-input').popover({
//       trigger: 'manual',
//       title: 'Guess invalid!',
//       content: "Please enter a number from 1 - 100.",
//       placement: 'top'
//     });
//     //alert("Please enter a number between 1 and 100.");
//   }
// }

function guess() {
  var $guessVal = $('.fn-guess-input').val();



  if ($guessVal === '' || $guessVal > 100 || $guessVal < 1) {
    alert("Please enter a number between 1 and 100.");
  }
  else if (numGuesses > 0) {
    revealSink();
    $('.fn-print-guess').text($guessVal);

    if (prevGuesses.indexOf($guessVal) === -1) {
      prevGuesses.push($guessVal);
      console.log(prevGuesses);

      numGuesses--;
      updateNumGuesses();

      displayPrevGuesses(prevGuesses);
      temp($guessVal);
      highOrLow($guessVal);

    } else {
      alert("You've already tried: " + $guessVal);
    }

  }
  // else if (numGuesses === 0) {
  //   $(this).attr('disabled', 'disabled');
  // }
  $('.fn-guess-input').focus();
}

function temp($guessVal) {
  var guessDiff = Math.abs(theNumber - $guessVal);

  if (guessDiff === 0) {
    console.log(options.win);

    $('.fn-win-alert').html(options.win).slideDown('slow').siblings().slideUp('slow');
    $('.fn-guess-btn').attr('disabled', 'disabled');

    $('.fn-win-modal').modal('show');
  }
  else if (guessDiff <= 5) {
    console.log(options.hottest);
    $('.fn-hot-alert').html(options.hottest + highOrLow($guessVal)).slideDown('slow').siblings().slideUp('slow');
  }
  else if (guessDiff <= 10) {
    console.log(options.hot);
    $('.fn-hot-alert').html(options.hot + highOrLow($guessVal)).slideDown('slow').siblings().slideUp('slow');
  }
  else if (guessDiff <= 15) {
    console.log(options.warm);
    $('.fn-hot-alert').html(options.warm + highOrLow($guessVal)).slideDown('slow').siblings().slideUp('slow');
  }
  else if (guessDiff <= 20) {
    console.log(options.cool);
    $('.fn-cold-alert').html(options.cool + highOrLow($guessVal)).slideDown('slow').siblings().slideUp('slow');
  }
  else if (guessDiff <= 25) {
    console.log(options.cold);
    $('.fn-cold-alert').html(options.cold + highOrLow($guessVal)).slideDown('slow').siblings().slideUp('slow');
  }
  else if (guessDiff >= 30) {
    console.log(options.coldest);
    $('.fn-cold-alert').html(options.coldest + highOrLow($guessVal)).slideDown('slow').siblings().slideUp('slow');
  }
}


function tempAlerts() {
  //<div class="alert alert-success fn-win-alert" role="alert">You got it!</div>
}

function highOrLow($guessVal) {
  if (theNumber > $guessVal) {
    return options.higher;
  }
  else if (theNumber < $guessVal) {
    return options.lower;
  }
}

function revealSink() {
  $('.fn-sink').slideDown('slow');
}

function updateNumGuesses() {
  $('.fn-num-guesses').text(numGuesses + ' left');
  if (numGuesses === 0) {
    $('.fn-guess-btn').attr('disabled', 'disabled');
  }
}

function displayPrevGuesses(prevGuesses) {
  var res = 'Previous guesses: ';
  var sepr;
  for (var i = 0; i < prevGuesses.length; i++) {
    sepr = i === prevGuesses.length - 1 ? '':', ';

    if (prevGuesses[i] < theNumber) {
      res += prevGuesses[i] + '<span class="glyphicon glyphicon-arrow-up"></span>' + sepr;
    }
    else if (prevGuesses[i] > theNumber) {
      res += prevGuesses[i] + '<span class="glyphicon glyphicon-arrow-down"></span>' + sepr;
    } else {
      res += prevGuesses[i];
    }
  }
  $('#fn-num-guesses').html(res);
}


// play again function
function playAgain() {
  newGameState();
  prevGuesses = [];
  numGuesses = 7;
  updateNumGuesses();
  $('.fn-guess-input').val('');
  $('#fn-num-guesses').text('Your game has been restarted. Submit a new guess!');
  $('.fn-print-guess').text('?');
  $('.fn-guess-btn').removeAttr('disabled');
}

function newGameState() {
  generateNumber();
  $('.fn-hint-btn').attr("data-content", theNumber);
  $('.fn-guess-input').focus();
  $('.fn-guess-alerts').children().slideUp('slow');
}

function hint(num) {
  // $('.fn-answer p').append("The answer is: " + theNumber);
  $('.fn-hint-btn').attr("data-content", theNumber);
  // return "The answer is: " + num;
  $('.fn-hint-btn').popover();
}

$('.fn-guess-btn').on('click', guess);
$('.fn-guess-input').keypress(function(e) {
    if (e.which == 13) {
        guess();
    }
});
$('.fn-play-again-btn').on('click', playAgain);
//$('.fn-hint-btn').on('click', hint);
$('.fn-hint-btn').popover({trigger: 'focus'});