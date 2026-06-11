// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { expect } from 'chai';
import { describe } from 'mocha';
import { Ch5Platform } from '../ch5-core';
import { Ch5ImageUriModel, TSchemas } from './ch5-image-uri-model';

describe('Ch5ImageUriModel', () => {

    const schemas: TSchemas = {
        http: 'ch5-img-auth',
        https: 'ch5-img-auths'
    };

    const platformInstance = Ch5Platform.getInstance() as any;
    let originalGetPlatformInfo: () => any;

    before(() => {
        originalGetPlatformInfo = platformInstance.getPlatformInfo.bind(platformInstance);
    });

    beforeEach(() => {
        platformInstance.getPlatformInfo = () => ({
            credentialsViaQueryParams: false
        });
    });

    after(() => {
        platformInstance.getPlatformInfo = originalGetPlatformInfo;
    });

    it('should create a final auth URL for an http location', () => {
        const model = new Ch5ImageUriModel(
            schemas,
            'test',
            'Crestron1!',
            'http://disnamic.com/test/teaser1.jpg'
        );

        expect(model.toString()).to.equal('ch5-img-auth://test:Crestron1!@disnamic.com/test/teaser1.jpg');
    });

    it('should create a final auth URL for an https location using the secure schema', () => {
        const model = new Ch5ImageUriModel(
            schemas,
            'test',
            'Crestron1!',
            'https://disnamic.com/test/teaser1.jpg'
        );

        expect(model.toString()).to.equal('ch5-img-auths://test:Crestron1!@disnamic.com/test/teaser1.jpg');
    });

    it('should create a query-param URL when platform requires credentials via query params', () => {
        platformInstance.getPlatformInfo = () => ({
            credentialsViaQueryParams: true
        });

        const model = new Ch5ImageUriModel(
            schemas,
            'test',
            'Crestron1!',
            'http://disnamic.com/test/teaser1.jpg'
        );

        expect(model.toString()).to.equal('ch5-img-auth://disnamic.com/test/teaser1.jpg?cres_username=test&cres_password=Crestron1%2521');
    });

    it('should preserve existing query params and append credential query params to the final URL', () => {
        platformInstance.getPlatformInfo = () => ({
            credentialsViaQueryParams: true
        });

        const model = new Ch5ImageUriModel(
            schemas,
            'dummyUser',
            'dummyPass!',
            'http://example.com/images/sample.jpg?size=large&theme=dark'
        );

        expect(model.toString()).to.equal('ch5-img-auth://example.com/images/sample.jpg?size=large&theme=dark&cres_username=dummyUser&cres_password=dummyPass%2521');
    });

    it('should remove custom auth prefix and inline credentials from location', () => {
        const model = new Ch5ImageUriModel(
            schemas,
            'test',
            'Crestron1!',
            'ch5-img-auth://inlineUser:inlinePassword@disnamic.com/test/teaser1.jpg'
        );

        expect(model.location).to.equal('disnamic.com/test/teaser1.jpg');
        expect(model.toString()).to.equal('ch5-img-auth://test:Crestron1!@disnamic.com/test/teaser1.jpg');
    });

    it('should remove secure custom auth prefix and inline credentials from location', () => {
        const model = new Ch5ImageUriModel(
            schemas,
            'test',
            'Crestron1!',
            'ch5-img-auths://inlineUser:inlinePassword@disnamic.com/test/teaser1.jpg'
        );

        expect(model.location).to.equal('disnamic.com/test/teaser1.jpg');
        expect(model.toString()).to.equal('ch5-img-auth://test:Crestron1!@disnamic.com/test/teaser1.jpg');
    });

    it('should not remove inline credentials for non-custom URLs', () => {
        const model = new Ch5ImageUriModel(
            schemas,
            'test',
            'Crestron1!',
            'inlineUser:inlinePassword@disnamic.com/test/teaser1.jpg'
        );

        expect(model.location).to.equal('inlineUser:inlinePassword@disnamic.com/test/teaser1.jpg');
    });

    it('should use fallback query-param formatter when URL constructor throws', () => {
        platformInstance.getPlatformInfo = () => ({
            credentialsViaQueryParams: true
        });

        const originalURL = (global as any).URL;
        (global as any).URL = class {
            constructor() {
                throw new Error('forced URL failure');
            }
        } as any;

        try {
            const model = new Ch5ImageUriModel(
                schemas,
                'dummyUser',
                'dummyPass!',
                'http://example.com/images/sample.jpg?size=large&theme=dark'
            );

            expect(model.toString()).to.equal('ch5-img-auth://example.com/images/sample.jpg?size=large&theme=dark&cres_username=dummyUser&cres_password=dummyPass!');
        } finally {
            (global as any).URL = originalURL;
        }
    });

    it('should return empty string when username is missing', () => {
        const model = new Ch5ImageUriModel(
            schemas,
            '',
            'Crestron1!',
            'http://disnamic.com/test/teaser1.jpg'
        );

        expect(model.toString()).to.equal('');
    });

    it('should return empty string when password is missing', () => {
        const model = new Ch5ImageUriModel(
            schemas,
            'test',
            '',
            'http://disnamic.com/test/teaser1.jpg'
        );

        expect(model.toString()).to.equal('');
    });

    it('should default to user:password@host format when platform capability is missing', () => {
        platformInstance.getPlatformInfo = () => ({});

        const model = new Ch5ImageUriModel(
            schemas,
            'test',
            'Crestron1!',
            'http://disnamic.com/test/teaser1.jpg'
        );

        expect(model.toString()).to.equal('ch5-img-auth://test:Crestron1!@disnamic.com/test/teaser1.jpg');
    });

    it('should default to user:password@host format when credentialsViaQueryParams is not boolean', () => {
        platformInstance.getPlatformInfo = () => ({
            credentialsViaQueryParams: 'true'
        });

        const model = new Ch5ImageUriModel(
            schemas,
            'test',
            'Crestron1!',
            'http://disnamic.com/test/teaser1.jpg'
        );

        expect(model.toString()).to.equal('ch5-img-auth://test:Crestron1!@disnamic.com/test/teaser1.jpg');
    });

    it('should append query credentials with ? when no query params exist', () => {
        platformInstance.getPlatformInfo = () => ({
            credentialsViaQueryParams: true
        });

        const model = new Ch5ImageUriModel(
            schemas,
            'dummyUser',
            'dummyPass!',
            'http://example.com/images/sample.jpg'
        );

        expect(model.toString()).to.equal('ch5-img-auth://example.com/images/sample.jpg?cres_username=dummyUser&cres_password=dummyPass%2521');
    });

    it('should remove custom auth prefix even when inline credentials are not present', () => {
        const model = new Ch5ImageUriModel(
            schemas,
            'test',
            'Crestron1!',
            'ch5-img-auth://disnamic.com/test/teaser1.jpg'
        );

        expect(model.location).to.equal('disnamic.com/test/teaser1.jpg');
        expect(model.toString()).to.equal('ch5-img-auth://test:Crestron1!@disnamic.com/test/teaser1.jpg');
    });

    it('should use http schema when https schema is not provided', () => {
        const schemasWithoutHttps: TSchemas = {
            http: 'ch5-img-auth'
        };

        const model = new Ch5ImageUriModel(
            schemasWithoutHttps,
            'test',
            'Crestron1!',
            'https://disnamic.com/test/teaser1.jpg'
        );

        expect(model.toString()).to.equal('ch5-img-auth://test:Crestron1!@disnamic.com/test/teaser1.jpg');
    });

    it('should keep original user value when setting user to empty or null', () => {
        const model = new Ch5ImageUriModel(
            schemas,
            'initialUser',
            'Crestron1!',
            'http://disnamic.com/test/teaser1.jpg'
        );

        model.user = '';
        expect(model.user).to.equal('initialUser');

        model.user = null as any;
        expect(model.user).to.equal('initialUser');
    });

    it('should keep original password value when setting password to empty or null', () => {
        const model = new Ch5ImageUriModel(
            schemas,
            'test',
            'initialPassword',
            'http://disnamic.com/test/teaser1.jpg'
        );

        model.password = '';
        expect(model.password).to.equal('initialPassword');

        model.password = null as any;
        expect(model.password).to.equal('initialPassword');
    });

    it('should keep original location value when setting location to empty or null', () => {
        const model = new Ch5ImageUriModel(
            schemas,
            'test',
            'Crestron1!',
            'http://disnamic.com/test/teaser1.jpg'
        );

        model.location = '';
        expect(model.location).to.equal('disnamic.com/test/teaser1.jpg');

        model.location = null as any;
        expect(model.location).to.equal('disnamic.com/test/teaser1.jpg');
    });

    it('should keep original schemas when setting schemas to empty or null', () => {
        const model = new Ch5ImageUriModel(
            schemas,
            'test',
            'Crestron1!',
            'http://disnamic.com/test/teaser1.jpg'
        );

        model.schemas = {} as TSchemas;
        expect(model.schemas.http).to.equal('ch5-img-auth');
        expect(model.schemas.https).to.equal('ch5-img-auths');

        model.schemas = null as any;
        expect(model.schemas.http).to.equal('ch5-img-auth');
        expect(model.schemas.https).to.equal('ch5-img-auths');
    });
});