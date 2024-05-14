import * as cw from "aws-cdk-lib/aws-cloudwatch";

export function defineComparisonOperatorFromString(
  comparisonOperatorString: string,
) {
  if (comparisonOperatorString === "GREATER_OR_EQUAL") {
    return cw.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD;
  } else if (comparisonOperatorString === "GREATER") {
    return cw.ComparisonOperator.GREATER_THAN_THRESHOLD;
  } else if (comparisonOperatorString === "LESS") {
    return cw.ComparisonOperator.LESS_THAN_THRESHOLD;
  } else if (comparisonOperatorString === "LESS_OR_EQUAL") {
    return cw.ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD;
  } else if (comparisonOperatorString === "LESS_LOWER_OR_GREATER_UPPER") {
    return cw.ComparisonOperator
      .LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD;
  } else if (comparisonOperatorString === "GREATER_UPPER") {
    return cw.ComparisonOperator.GREATER_THAN_UPPER_THRESHOLD;
  } else {
    //comparisonOperatorString === "LESS_LOWER"
    return cw.ComparisonOperator.LESS_THAN_LOWER_THRESHOLD;
  }
}

export function defineTreatMissingDataFromString(
  treatMissingDataString: string,
) {
  if (treatMissingDataString === "BREACHING") {
    return cw.TreatMissingData.BREACHING;
  } else if (treatMissingDataString === "NOT_BREACHING") {
    return cw.TreatMissingData.NOT_BREACHING;
  } else if (treatMissingDataString === "IGNORE") {
    return cw.TreatMissingData.IGNORE;
  } else {
    //treatMissingDataString === "MISSING"
    return cw.TreatMissingData.IGNORE;
  }
}
