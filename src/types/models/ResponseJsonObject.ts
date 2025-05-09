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
/**
 * 
 * @export
 * @interface ResponseJsonObject
 */
export interface ResponseJsonObject {
    /**
     * 
     * @type {string}
     * @memberof ResponseJsonObject
     */
    message?: string;
    /**
     * 
     * @type {object}
     * @memberof ResponseJsonObject
     */
    result?: object;
    /**
     * 
     * @type {number}
     * @memberof ResponseJsonObject
     */
    status?: number;
}

/**
 * Check if a given object implements the ResponseJsonObject interface.
 */
export function instanceOfResponseJsonObject(value: object): value is ResponseJsonObject {
    return true;
}

export function ResponseJsonObjectFromJSON(json: any): ResponseJsonObject {
    return ResponseJsonObjectFromJSONTyped(json, false);
}

export function ResponseJsonObjectFromJSONTyped(json: any, ignoreDiscriminator: boolean): ResponseJsonObject {
    if (json == null) {
        return json;
    }
    return {
        
        'message': json['message'] == null ? undefined : json['message'],
        'result': json['result'] == null ? undefined : json['result'],
        'status': json['status'] == null ? undefined : json['status'],
    };
}

export function ResponseJsonObjectToJSON(json: any): ResponseJsonObject {
    return ResponseJsonObjectToJSONTyped(json, false);
}

export function ResponseJsonObjectToJSONTyped(value?: ResponseJsonObject | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'message': value['message'],
        'result': value['result'],
        'status': value['status'],
    };
}

