'use strict';

var request = require('supertest');
var server = require('../app.js');

describe('TV Service', function() {

    describe('Parameters', function() {
        describe('Valid parameter format and value', function() {

            it('should return contour data based on callsign', function(done) {

                request(server)
                    .get('/tv/callsign/wbal-tv.json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        res.body.should.have.property('features');
                        res.body.features[0].geometry.should.have.property('coordinates');
                        done();
                    });
            });

            it('should return contour data based on facilityid', function(done) {

                request(server)
                    .get('/tv/facilityid/65670.json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        res.body.should.have.property('features');
                        res.body.features[0].geometry.should.have.property('coordinates');
                        done();
                    });
            });

            it('should return contour data based on filenumber', function(done) {

                request(server)
                    .get('/tv/filenumber/BLCDT-20110706ABC.json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        res.body.should.have.property('features');
                        res.body.features[0].geometry.should.have.property('coordinates');
                        done();
                    });
            });

            it('should return contour data based on applicationid', function(done) {

                request(server)
                    .get('/tv/applicationid/1402663.json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        res.body.should.have.property('features');
                        res.body.features[0].geometry.should.have.property('coordinates');
                        done();
                    });
            });
        });

        describe('Invalid parameter format', function() {
            it('should return error 500 for invalid callsign format', function(done) {

                request(server)
                    .get('/tv/callsign/%2322.json')
                    .expect('Content-Type', /json/)
                    .expect(500, done);
            });

            it('should return error 500 for invalid facilityid format', function(done) {

                request(server)
                    .get('/tv/facilityid/errr.json')
                    .expect('Content-Type', /json/)
                    .expect(500, done);
            });

            it('should return error 500 for invalid filenumber format', function(done) {

                request(server)
                    .get('/tv/filenumber/&23.json')
                    .expect('Content-Type', /json/)
                    .expect(500, done);
            });

            it('should return error 500 for invalid applicationid format', function(done) {

                request(server)
                    .get('/tv/applicationid/&23.json')
                    .expect('Content-Type', /json/)
                    .expect(500, done);
            });

        });

        describe('Invalid parameter value', function() {
            it('should not return contour data for invalid callsign value', function(done) {

                request(server)
                    .get('/tv/callsign/errr-tv.json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        res.body.totalFeatures.should.equal(0);
                        res.body.features.length.should.equal(0);
                        done();
                    });
            });

            it('should not return contour data for invalid facilityid value', function(done) {

                request(server)
                    .get('/tv/facilityid/9.json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        res.body.totalFeatures.should.equal(0);
                        res.body.features.length.should.equal(0);
                        done();
                    });
            });

            it('should not return contour data for invalid filenumber value', function(done) {

                request(server)
                    .get('/tv/filenumber/9.json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        res.body.totalFeatures.should.equal(0);
                        res.body.features.length.should.equal(0);
                        done();
                    });
            });

            it('should not return contour data for invalid applicationid value', function(done) {

                request(server)
                    .get('/tv/applicationid/9.json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        res.body.totalFeatures.should.equal(0);
                        res.body.features.length.should.equal(0);
                        done();
                    });
            });
        });

        describe('Unused parameters', function() {
            it('should return error 500 when antennaid is used', function(done) {

                request(server)
                    .get('/tv/antennaid/wjla-tv.json')
                    .expect('Content-Type', /json/)
                    .expect(500, done);
            });

            it('should ignore stationClass and timePeriod parameters', function(done) {

                request(server)
                    .get('/tv/callsign/wjla-tv.json?stationClass=c&timePeriod=day')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        }

                        res.body.features[0].properties.should.not.have.property('class');
                        res.body.features[0].properties.should.not.have.property('time_period');
                        done();
                    });
            });
        });
    });





    describe('File formats', function() {

        it('should return JSON format', function(done) {

            request(server)
                .get('/tv/callsign/wjla-tv.json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

        //JSONP not supported
        // it('should return JSONP format', function(done) {    

        //   request(server)
        //     .get('/tv/callsign/wjla-tv.jsonp')
        //     .expect('Content-Type', /jsonp/)
        //     .expect(200, done);
        // });


        it('should return SHP format', function(done) {

            request(server)
                .get('/tv/callsign/wjla-tv.shp')
                .expect('Content-Type', /application\/zip/)
                .expect(200, done);
        });

        it('should return KML format', function(done) {

            request(server)
                .get('/tv/callsign/wjla-tv.kml')
                .expect('Content-Type', /kml/)
                .expect(200, done);
        });

        it('should return GML format', function(done) {

            request(server)
                .get('/tv/callsign/wjla-tv.gml')
                .expect('Content-Type', /gml/)
                .expect(200, done);
        });

        it('should return CSV format', function(done) {

            request(server)
                .get('/tv/callsign/wjla-tv.csv')
                .expect('Content-Type', /csv/)
                .expect(200, done);
        });

    });

});
