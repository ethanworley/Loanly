function CalculatorCtrl($scope){
	
	$scope.flavourTexts = [
		"Add a loan",
		"Add another loan",
		"Add another loan",
		"Another!",
		"One more",
		"I'll tell you when I've had enough",
		"Hit me baby one more time",
		"Oops, I did it again, and now I require another loan",
		"So loanly..."
	];
	
	$scope.loans = [
		new Loan("A")
	];
	
	$scope.paymentStrategies = [
		{text:"largest loans", value:1},
		{text:"smallest loans", value:2},
		{text:"loans accruing the most interest", value:3},
		{text:"loans accruing the least interest", value:4}
	];
	
	$scope.paymentStrategy = $scope.paymentStrategies[0];
	
	$scope.totalLoans = $scope.loans.length;
	
	$scope.flavourText = $scope.flavourTexts[1];
	
	$scope.addLoan = function(){
		var letterValue = 0;
		if($scope.loans.length > 0){
			letterValue = ($scope.loans[$scope.loans.length - 1].name.charCodeAt(0) - 64) % 26;
		}
		$scope.loans.push(new Loan(String.fromCharCode(65 + letterValue)));
		$scope.totalLoans = $scope.loans.length;
		$scope.setFlavourText();
	}
	
	$scope.setFlavourText = function(){
		if( $scope.loans.length < $scope.flavourTexts.length){
			$scope.flavourText = $scope.flavourTexts[$scope.loans.length];
		} else {
			//var index = Math.floor(Math.random() * $scope.flavourTexts.length);
			$scope.flavourText = $scope.flavourTexts[1];
		}
	}
	
	$scope.remove = function(loan){
		for(var i = $scope.loans.length - 1; i >= 0; i--){
			if($scope.loans[i] == loan){
				$scope.loans.splice(i,1);
			}
		}
		$scope.setFlavourText();
	}
	
	$scope.validate = function(loan){
		
	}
	
	$scope.calculate = function(loan){
		
		loan.interestPercentage = loan.interestRate / 100;
		loan.interestOnLoan = (loan.loanBalance * loan.interestPercentage) / 12; // per month
		
		if(loan.interestOnLoan >= loan.repaymentRate){
			loan.outputText = "You'll never pay it off with that attitude! You need to repay at least $" + (loan.interestOnLoan + 0.01).toFixed(2)+ " a month.";
		} else {
			loan.outputText = "loan balance after a month! " + loan.interestOnLoan;
			
			var months = 0;
			var years = 0;
			var currentLoanBalance = loan.loanBalance;
			var currentInterest = currentLoanBalance * loan.interestPercentage / 12;
			var totalPaid = 0;
			
			while(currentLoanBalance > 0){
				
				currentInterest = currentLoanBalance * loan.interestPercentage / 12;
				
				currentLoanBalance += currentInterest;
				currentLoanBalance -= loan.repaymentRate;
				totalPaid += loan.repaymentRate;
				if(currentLoanBalance < 0){
					totalPaid += currentLoanBalance;
				}
				
				
				//if(months > 12 * (years + 1)){
					
				//	years++;
				//}
				months ++;
				
			}
			
			var yearsText = "";
			var monthsText = "";
			
			if(years > 0){
				yearsText = years + " year ";
				if(years > 1){
					yearsText = years + " years ";
				}
			}
			if(months % 12 > 0){
				monthsText = (months % 12) + " month ";
				if(months % 12 > 1){
					monthsText = (months % 12) + " months ";
				}
			}
			
			loan.outputText = "Woohoo! That only took " + $scope.monthsToYearsMonths(months) + "and $" + parseFloat(totalPaid).toFixed(2) + "!";
		}
	}
	
	$scope.monthsToYearsMonths = function(months){
		var yearsText = "";
		var monthsText = "";
		
		var _years = Math.floor(months / 12);
		if(_years == 1){
			yearsText = _years + " year ";
		}
		
		if(_years > 1){
			yearsText = _years + " years ";
		}
		
		var _months = months % 12;
		
		if(_months == 1){
			monthsText = _months  + " month ";
		}
		
		if(_months > 1){
			monthsText = _months + " months ";
		}
		
		if(_months < 1 && _years < 1){
			monthsText = _months + " months ";
		}
		
		return yearsText + monthsText;
	}
	
	$scope.simulationRepaymentRate = 0;
	
	$scope.loanRepaymentEvents = [];
	
	$scope.simulationText = "\u00A0";
	
	$scope.simulate = function(){
		
		$scope.simulationText = "\u00A0";
		
		if($scope.loans.length < 1){
			$scope.simulationText = "Add a loan first!";
			return;
		}
		
		$scope.simulationText = "Paying off the " + $scope.paymentStrategy.text + " first. ";
		
		var loansArray = $scope.loans.slice(0);
		
		switch($scope.paymentStrategy.value){
			case 1:
				loansArray.sort($scope.largestBalance);
				break;
			
			case 2:
				loansArray.sort($scope.smallestBalance);
				break;
			
			case 3:
				loansArray.sort($scope.mostInterest);
				
				break;
			
			case 4:
				loansArray.sort($scope.leastInterest);
				
				break;
			
			default:
				break;
		}
		
		var totalBalance = 1;
		var repaymentRate = $scope.simulationRepaymentRate;
		
		var minimum = 0;
		
		var totalPaid = 0;
		
		$scope.loanRepaymentEvents = [];
		
		loansArray = loansArray.reverse();
		
		ignored = "";
		
		for (var i = loansArray.length-1; i >= 0; i--) {
			if(loansArray[i].loanBalance === undefined || loansArray[i].loanBalance <= 0){
				ignored += loansArray[i].name + ", ";
				loansArray.splice(i,1);
			} else {
				minimum += loansArray[i].loanBalance * ((loansArray[i].interestRate / 100) / 12);
			}
		}
		
		if(ignored.length > 0){
			ignored = ignored.substr(0, ignored.length - 2);
			if(ignored.length == 1){
				$scope.loanRepaymentEvents.push("Ignored loan " + ignored + " because the balance was $0 or less");
			}
			if(ignored.length > 1){
				$scope.loanRepaymentEvents.push("Ignored loans " + ignored + " because the balances were $0 or less");
			}
		}
		
		loansArray = loansArray.reverse();
		
		if(repaymentRate < minimum + 0.01)
		{
			$scope.simulationText = "You'll never pay it off with that attitude! You need to repay at least $" + (minimum + 0.01).toFixed(2)+ " a month.";
		} else {
			
			var months = 0;
			
			var currentLoanBalance = loansArray[0].loanBalance;
			var currentInterestRate = ((loansArray[0].interestRate / 100) / 12);
			
			while (currentLoanBalance > 0){
				repaymentRate = $scope.simulationRepaymentRate;
				
				totalPaid += repaymentRate;
				
				var minimumPayment = currentLoanBalance * currentInterestRate;
				currentLoanBalance += minimumPayment;
				
				for (var i = 1; i < loansArray.length; i++){
					
					minimumPayment = loansArray[i].loanBalance * ((loansArray[i].interestRate / 100) / 12);
					repaymentRate -= minimumPayment;
				}
				
				currentLoanBalance -= repaymentRate;
				
				months ++;
				
				while(currentLoanBalance <= 0 && loansArray.length > 0){
					
					var remainder = 0 - currentLoanBalance;
					$scope.loanRepaymentEvents.push("Paid off loan " + loansArray[0].name + " in " + $scope.monthsToYearsMonths(months) + " and $" + (totalPaid-remainder).toFixed(2));
					
					loansArray = loansArray.slice(1);
					
					if(loansArray.length > 0){
						currentLoanBalance = loansArray[0].loanBalance;
						currentInterestRate = ((loansArray[0].interestRate / 100) / 12);
						
						currentLoanBalance -= remainder;
						
					} else {
						loansArray = loansArray.slice(1);
						totalPaid -= remainder;
					}
				}
				
				
			}
			$scope.loanRepaymentEvents.push("\u00A0");
			$scope.loanRepaymentEvents.push("Total Time: " + $scope.monthsToYearsMonths(months));
			$scope.loanRepaymentEvents.push("Total Paid: $" + totalPaid.toFixed(2));
		}
		
	}
	
	$scope.largestBalance = function(a,b){
		return b.loanBalance - a.loanBalance;
	}
	
	$scope.smallestBalance = function(a,b){
		return a.loanBalance - b.loanBalance;
	}
	
	$scope.mostInterest = function(a,b){
		return (b.loanBalance * b.interestRate / 100) - (a.loanBalance * a.interestRate / 100);
	}
	
	$scope.leastInterest = function(a,b){
		return (a.loanBalance * a.interestRate / 100) - (b.loanBalance * b.interestRate / 100);
	}
	
}

function Loan(name){

	this.name = name;
	
	this.loanBalance = 1000.00;
	this.repaymentRate = 10.00;
	
	//var repaymentPeriod = parseFloat($(":selected",$("#repaymentPeriod")).attr("value"));
	
	//var interestPeriod = parseFloat($(":selected",$("#interestPeriod")).attr("value"));
	
	this.interestRate = 10.00;
	
	this.outputText = "\u00A0";
}


