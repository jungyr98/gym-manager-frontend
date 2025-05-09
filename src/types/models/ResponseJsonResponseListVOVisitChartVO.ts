/* tslint:disable */
/* eslint-disable */
/**
 * Gym Manager Swagger
 * Gym Manager REST API
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
import type { ResponseListVOVisitChartVO } from './ResponseListVOVisitChartVO';
import {
    ResponseListVOVisitChartVOFromJSON,
    ResponseListVOVisitChartVOFromJSONTyped,
    ResponseListVOVisitChartVOToJSON,
    ResponseListVOVisitChartVOToJSONTyped,
} from './ResponseListVOVisitChartVO';

/**
 * 
 * @export
 * @interface ResponseJsonResponseListVOVisitChartVO
 */
export interface ResponseJsonResponseListVOVisitChartVO {
    /**
     * 
     * @type {string}
     * @memberof ResponseJsonResponseListVOVisitChartVO
     */
    message?: string;
    /**
     * 
     * @type {ResponseListVOVisitChartVO}
     * @memberof ResponseJsonResponseListVOVisitChartVO
     */
    result?: ResponseListVOVisitChartVO;
    /**
     * 
     * @type {number}
     * @memberof ResponseJsonResponseListVOVisitChartVO
     */
    status?: number;
}

/**
 * Check if a given object implements the ResponseJsonResponseListVOVisitChartVO interface.
 */
export function instanceOfResponseJsonResponseListVOVisitChartVO(value: object): value is ResponseJsonResponseListVOVisitChartVO {
    return true;
}

export function ResponseJsonResponseListVOVisitChartVOFromJSON(json: any): ResponseJsonResponseListVOVisitChartVO {
    return ResponseJsonResponseListVOVisitChartVOFromJSONTyped(json, false);
}

export function ResponseJsonResponseListVOVisitChartVOFromJSONTyped(json: any, ignoreDiscriminator: boolean): ResponseJsonResponseListVOVisitChartVO {
    if (json == null) {
        return json;
    }
    return {
        
        'message': json['message'] == null ? undefined : json['message'],
        'result': json['result'] == null ? undefined : ResponseListVOVisitChartVOFromJSON(json['result']),
        'status': json['status'] == null ? undefined : json['status'],
    };
}

export function ResponseJsonResponseListVOVisitChartVOToJSON(json: any): ResponseJsonResponseListVOVisitChartVO {
    return ResponseJsonResponseListVOVisitChartVOToJSONTyped(json, false);
}

export function ResponseJsonResponseListVOVisitChartVOToJSONTyped(value?: ResponseJsonResponseListVOVisitChartVO | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'message': value['message'],
        'result': ResponseListVOVisitChartVOToJSON(value['result']),
        'status': value['status'],
    };
}

