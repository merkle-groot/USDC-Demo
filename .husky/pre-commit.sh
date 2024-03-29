#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx prettier --write "contracts/*.sol" && echo "Prettier executed"
npx eslint --fix . && echo "Linting completed"
npx hardhat coverage --testfiles "test/*.js"
lines_covered=`jq .total.lines.pct $(dirname "$0")/../coverage/coverage-summary.json`
statements_covered=`jq .total.statements.pct $(dirname "$0")/../coverage/coverage-summary.json`
functions_covered=`jq .total.functions.pct $(dirname "$0")/../coverage/coverage-summary.json`
branches_covered=`jq .total.branches.pct $(dirname "$0")/../coverage/coverage-summary.json`
lc=${lines_covered%.*}
sc=${statements_covered%.*}
fc=${functions_covered%.*}
bc=${branches_covered%.*}
if(([ $lc -ge 95 ] && [ $sc -ge 95 ] && [ $fc -ge 95 ] && [ $bc -ge 95 ] ))
then
        echo "Coverage is met"
else
        echo "Coverage is not met"
        exit 1
fi