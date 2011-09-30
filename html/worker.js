self.addEventListener('message', function(e) {
  var data = e.data;
  switch (data.cmd) {
    case 'start':
        self.postMessage('WORKER STARTED - calculating numbers to : ' + data.stop);
            var primes;
        for (i = 2; i <= data.stop; i++) {
            if (isPrimeNumber(i)) {
                primes += i + ", ";
           }
        }
      self.postMessage('WORKER FINISHED: ' + primes);
      break;
      default: {
          self.postMessage("Unknown command");
      }
  }
}, false);


function isPrimeNumber(number) {
    var max = Math.sqrt(number);
    for (var i = 2; i <= max; i++) {
        if ( (number % i) == 0) {
            return false;
        }
    }
    return true;
}