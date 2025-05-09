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
 * @interface AccountVO
 */
export interface AccountVO {
    /**
     * 
     * @type {string}
     * @memberof AccountVO
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof AccountVO
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof AccountVO
     */
    pw?: string;
}

/**
 * Check if a given object implements the AccountVO interface.
 */
export function instanceOfAccountVO(value: object): value is AccountVO {
    return true;
}

export function AccountVOFromJSON(json: any): AccountVO {
    return AccountVOFromJSONTyped(json, false);
}

export function AccountVOFromJSONTyped(json: any, ignoreDiscriminator: boolean): AccountVO {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'name': json['name'] == null ? undefined : json['name'],
        'pw': json['pw'] == null ? undefined : json['pw'],
    };
}

export function AccountVOToJSON(json: any): AccountVO {
    return AccountVOToJSONTyped(json, false);
}

export function AccountVOToJSONTyped(value?: AccountVO | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'id': value['id'],
        'name': value['name'],
        'pw': value['pw'],
    };
}

