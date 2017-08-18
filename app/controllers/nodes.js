var express = require('express');
var router = express.Router();

var bech32 = require('bech32');
var btc = require('bitcoinjs-lib');

var LitNode = require('../models/litnode');

router.post('/announce', function(req, res) {
    req.checkBody('pbk', 'Public key is required').notEmpty().isAlphanumeric();
    req.checkBody('addr', 'Lit address is required').notEmpty().isAlphanumeric();
    req.checkBody('url', 'url is required').notEmpty();
    req.checkBody('sig', 'Signature is required').notEmpty();
    
    req.getValidationResult().then(function(errors) {
        if(!errors.isEmpty()) {
            var errs = [];
            for(var i in errors.array()) {
                errs.push(errors.array()[i]["msg"]);
            }
            return res.json({success: false,
                             message: errs
                            });
        }
        
        var pkh;
        
        // Check public key with lit address
        try {
            pkh = bech32.decode(req.body.addr);
        } catch(err) {
            return res.json({success: false,
                             message: err.message
                            });
        }
        
        // Check PKH == SHA256(PK)
        var pbk = Buffer.from(req.body.pbk, 'hex');
        if(Array.prototype.slice.call(btc.crypto.sha256(pbk), 0)
                                .slice(0, 20).toString() != 
           bech32.fromWords(pkh.words).toString()) {
            return res.json({success: false,
                             message: 'Public key incorrect'
                            });
        }

        // Check ecdsa(url, sig, pkey)
        var keyPair = btc.ECPair.fromPublicKeyBuffer(pbk);
        var sig = btc.ECSignature.fromDER(Buffer.from(req.body.sig, 'hex'));
        if(!keyPair.verify(btc.crypto.sha256(req.body.url), sig)) {
            return res.json({success: false,
                             message: 'Signature incorrect'
                            });
        }
        
        LitNode.findOne({ addr: req.body.addr }, function(err, litnode) {
            if(err) {
                return res.json({success: false,
                                 message: err
                                });
            }
            
            if(!litnode) {
                litnode = new LitNode();
            }
            
            litnode.url = req.body.url;
            litnode.addr = req.body.addr;
            
            litnode.save(function(err) {
                if(err) {
                    return res.json({success: false,
                                     message: err
                                    });
                }
                
                res.json({success: true});
            });
        });
    });
});

router.get('/:node_id', function(req, res) {
    LitNode.findOne({ addr: req.params.node_id }, function(err, litnode) {
        if(err) {
            return res.json({success: false,
                             message: err
                            });
        }
        
        if(!litnode) {
            return res.json({success: false,
                             message: 'Node not found'
                            });
        }
        
        return res.json({success: true,
                         node: {
                             addr: litnode.addr,
                             url: litnode.url
                         }
                        });
    });
});

module.exports = router;
