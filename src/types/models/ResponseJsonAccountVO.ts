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
import type { AccountVO } from './AccountVO';
import {
    AccountVOFromJSON,
    AccountVOFromJSONTyped,
    AccountVOToJSON,
    AccountVOToJSONTyped,
} from './AccountVO';

/**
 * 
 * @export
 * @interface ResponseJsonAccountVO
 */
export interface ResponseJsonAccountVO {
    /**
     * 
     * @type {string}
     * @memberof ResponseJsonAccountVO
     */
    message?: string;
    /**
     * 
     * @type {AccountVO}
     * @memberof ResponseJsonAccountVO
     */
    result?: AccountVO;
    /**
     * 
     * @type {number}
     * @memberof ResponseJsonAccountVO
     */
    status?: number;
}

/**
 * Check if a given object implements the ResponseJsonAccountVO interface.
 */
export function instanceOfResponseJsonAccountVO(value: object): value is ResponseJsonAccountVO {
    return true;
}

export function ResponseJsonAccountVOFromJSON(json: any): ResponseJsonAccountVO {
    return ResponseJsonAccountVOFromJSONTyped(json, false);
}

export function ResponseJsonAccountVOFromJSONTyped(json: any, ignoreDiscriminator: boolean): ResponseJsonAccountVO {
    if (json == null) {
        return json;
    }
    return {
        
        'message': json['message'] == null ? undefined : json['message'],
        'result': json['result'] == null ? undefined : AccountVOFromJSON(json['result']),
        'status': json['status'] == null ? undefined : json['status'],
    };
}

export function ResponseJsonAccountVOToJSON(json: any): ResponseJsonAccountVO {
    return ResponseJsonAccountVOToJSONTyped(json, false);
}

export function ResponseJsonAccountVOToJSONTyped(value?: ResponseJsonAccountVO | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'message': value['message'],
        'result': AccountVOToJSON(value['result']),
        'status': value['status'],
    };
}

