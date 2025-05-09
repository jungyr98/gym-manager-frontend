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
 * 방문 내역 테이블
 * @export
 * @interface VisitHistory
 */
export interface VisitHistory {
    /**
     * 회원 시퀀스
     * @type {number}
     * @memberof VisitHistory
     */
    memberSeq?: number;
    /**
     * 등록 일자
     * @type {Date}
     * @memberof VisitHistory
     */
    regDate?: Date;
    /**
     * 방문 내역 시퀀스
     * @type {number}
     * @memberof VisitHistory
     */
    vhSeq?: number;
}

/**
 * Check if a given object implements the VisitHistory interface.
 */
export function instanceOfVisitHistory(value: object): value is VisitHistory {
    return true;
}

export function VisitHistoryFromJSON(json: any): VisitHistory {
    return VisitHistoryFromJSONTyped(json, false);
}

export function VisitHistoryFromJSONTyped(json: any, ignoreDiscriminator: boolean): VisitHistory {
    if (json == null) {
        return json;
    }
    return {
        
        'memberSeq': json['memberSeq'] == null ? undefined : json['memberSeq'],
        'regDate': json['regDate'] == null ? undefined : (new Date(json['regDate'])),
        'vhSeq': json['vhSeq'] == null ? undefined : json['vhSeq'],
    };
}

export function VisitHistoryToJSON(json: any): VisitHistory {
    return VisitHistoryToJSONTyped(json, false);
}

export function VisitHistoryToJSONTyped(value?: VisitHistory | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'memberSeq': value['memberSeq'],
        'regDate': value['regDate'] == null ? undefined : ((value['regDate']).toISOString()),
        'vhSeq': value['vhSeq'],
    };
}

