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
import type { PaymentsHistory } from './PaymentsHistory';
import {
    PaymentsHistoryFromJSON,
    PaymentsHistoryFromJSONTyped,
    PaymentsHistoryToJSON,
    PaymentsHistoryToJSONTyped,
} from './PaymentsHistory';

/**
 * 
 * @export
 * @interface MemberVO
 */
export interface MemberVO {
    /**
     * 
     * @type {string}
     * @memberof MemberVO
     */
    endDate?: string;
    /**
     * 주소
     * @type {string}
     * @memberof MemberVO
     */
    memberAddr?: string;
    /**
     * 생년월일
     * @type {string}
     * @memberof MemberVO
     */
    memberBirth?: string;
    /**
     * 이름
     * @type {string}
     * @memberof MemberVO
     */
    memberName?: string;
    /**
     * 전화번호
     * @type {string}
     * @memberof MemberVO
     */
    memberPhone?: string;
    /**
     * 회원 시퀀스
     * @type {number}
     * @memberof MemberVO
     */
    memberSeq?: number;
    /**
     * 성별
     * @type {string}
     * @memberof MemberVO
     */
    memberSex?: string;
    /**
     * 
     * @type {PaymentsHistory}
     * @memberof MemberVO
     */
    paymentsHistory?: PaymentsHistory;
    /**
     * 최초 생성일자
     * @type {Date}
     * @memberof MemberVO
     */
    regDate?: Date;
    /**
     * 
     * @type {string}
     * @memberof MemberVO
     */
    startDate?: string;
    /**
     * 사업장 시퀀스
     * @type {number}
     * @memberof MemberVO
     */
    wpSeq?: number;
}

/**
 * Check if a given object implements the MemberVO interface.
 */
export function instanceOfMemberVO(value: object): value is MemberVO {
    return true;
}

export function MemberVOFromJSON(json: any): MemberVO {
    return MemberVOFromJSONTyped(json, false);
}

export function MemberVOFromJSONTyped(json: any, ignoreDiscriminator: boolean): MemberVO {
    if (json == null) {
        return json;
    }
    return {
        
        'endDate': json['endDate'] == null ? undefined : json['endDate'],
        'memberAddr': json['memberAddr'] == null ? undefined : json['memberAddr'],
        'memberBirth': json['memberBirth'] == null ? undefined : json['memberBirth'],
        'memberName': json['memberName'] == null ? undefined : json['memberName'],
        'memberPhone': json['memberPhone'] == null ? undefined : json['memberPhone'],
        'memberSeq': json['memberSeq'] == null ? undefined : json['memberSeq'],
        'memberSex': json['memberSex'] == null ? undefined : json['memberSex'],
        'paymentsHistory': json['paymentsHistory'] == null ? undefined : PaymentsHistoryFromJSON(json['paymentsHistory']),
        'regDate': json['regDate'] == null ? undefined : (new Date(json['regDate'])),
        'startDate': json['startDate'] == null ? undefined : json['startDate'],
        'wpSeq': json['wpSeq'] == null ? undefined : json['wpSeq'],
    };
}

export function MemberVOToJSON(json: any): MemberVO {
    return MemberVOToJSONTyped(json, false);
}

export function MemberVOToJSONTyped(value?: MemberVO | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'endDate': value['endDate'],
        'memberAddr': value['memberAddr'],
        'memberBirth': value['memberBirth'],
        'memberName': value['memberName'],
        'memberPhone': value['memberPhone'],
        'memberSeq': value['memberSeq'],
        'memberSex': value['memberSex'],
        'paymentsHistory': PaymentsHistoryToJSON(value['paymentsHistory']),
        'regDate': value['regDate'] == null ? undefined : ((value['regDate']).toISOString()),
        'startDate': value['startDate'],
        'wpSeq': value['wpSeq'],
    };
}

