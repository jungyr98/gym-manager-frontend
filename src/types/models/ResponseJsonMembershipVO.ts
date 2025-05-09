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
import type { MembershipVO } from './MembershipVO';
import {
    MembershipVOFromJSON,
    MembershipVOFromJSONTyped,
    MembershipVOToJSON,
    MembershipVOToJSONTyped,
} from './MembershipVO';

/**
 * 
 * @export
 * @interface ResponseJsonMembershipVO
 */
export interface ResponseJsonMembershipVO {
    /**
     * 
     * @type {string}
     * @memberof ResponseJsonMembershipVO
     */
    message?: string;
    /**
     * 
     * @type {MembershipVO}
     * @memberof ResponseJsonMembershipVO
     */
    result?: MembershipVO;
    /**
     * 
     * @type {number}
     * @memberof ResponseJsonMembershipVO
     */
    status?: number;
}

/**
 * Check if a given object implements the ResponseJsonMembershipVO interface.
 */
export function instanceOfResponseJsonMembershipVO(value: object): value is ResponseJsonMembershipVO {
    return true;
}

export function ResponseJsonMembershipVOFromJSON(json: any): ResponseJsonMembershipVO {
    return ResponseJsonMembershipVOFromJSONTyped(json, false);
}

export function ResponseJsonMembershipVOFromJSONTyped(json: any, ignoreDiscriminator: boolean): ResponseJsonMembershipVO {
    if (json == null) {
        return json;
    }
    return {
        
        'message': json['message'] == null ? undefined : json['message'],
        'result': json['result'] == null ? undefined : MembershipVOFromJSON(json['result']),
        'status': json['status'] == null ? undefined : json['status'],
    };
}

export function ResponseJsonMembershipVOToJSON(json: any): ResponseJsonMembershipVO {
    return ResponseJsonMembershipVOToJSONTyped(json, false);
}

export function ResponseJsonMembershipVOToJSONTyped(value?: ResponseJsonMembershipVO | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'message': value['message'],
        'result': MembershipVOToJSON(value['result']),
        'status': value['status'],
    };
}

