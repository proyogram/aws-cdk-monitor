#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { CwAlarmStack } from "../lib/cw_alarm/main";

const app = new cdk.App();

const test = new CwAlarmStack(app, "CwAlarmStack");
