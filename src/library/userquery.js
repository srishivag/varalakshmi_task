const { raw } = require('objection');
const moment = require('moment');

let insertTable = (tablemap, data) => {
    return new Promise((resolve, reject) => {
        let mod = tablemap.query().insert(data);
        mod.then(result => {
            resolve(result);
        }).catch(error => {
            reject(error);
        })
    });
}

let simpleselect = (tablemap, columnlist, whereCond, orderBy) => {
    return new Promise((resolve, reject) => {
        let mod = tablemap.query().select(columnlist)
        if (whereCond) {
            mod = mod.whereRaw(whereCond)
        }

        if (orderBy) mod = mod.orderByRaw(orderBy);

        mod.then(result => {
            resolve(result);
        }).catch(error => {
            reject(error);
        })
    });
}

let selectquery = (tablemap, modalAlias, columnlist, joinrelationtable, columngroupby, columnorderby) => {
    let query = '';
    return new Promise((resolve, reject) => {
        query = tablemap.query().select(columnlist)
        if (modalAlias) {
            query = query.alias(modalAlias)
        }
        if (joinrelationtable) {
            query = query.leftJoinRelation(joinrelationtable)
        }
        if (columngroupby) {
            query = query.groupBy(columngroupby)
        }
        if (columnorderby) {
            query = query.orderByRaw(columnorderby)
        }
        query.then(result => {
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    });
}


let selectquerywithwhere = (tableMap, modalAlias, columnList, joinRelation, columnwhere, columngroupby, columnorderby) => {
    let query = '';
    return new Promise((resolve, reject) => {
        query = tableMap.query().select(columnList)
        if (modalAlias) {
            query = query.alias(modalAlias)
        }
        if (joinRelation) {
            query = query.leftJoinRelation(joinRelation)
        }
        if (columnwhere) {
            query = query.where(columnwhere)
        }
        if (columngroupby) {
            query = query.groupBy(columngroupby)
        }
        if (columnorderby) {
            query = query.orderByRaw(columnorderby)
        }
        query.then(result => {
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    });
}
// function to select the based on where clause and groupby a column
let selectwithWherecondandgroupby = (tablemap, columnlist, whereClause, columngroupby) => {
    let query = '';
    return new Promise((resolve, reject) => {
        query = tablemap.query().select(columnlist)
        if (whereClause) {
            query = query.where(whereClause)
        }
        if (columngroupby) {
            query = query.groupBy(columngroupby)
        }
        // console.log(query.toString())
        query.then(result => {
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    });
}

// function to select the data from table with one condition
let selectwithcond = (tablemap, columnlist, conditionkey) => {
    return new Promise((resolve, reject) => {
        tablemap
            .query()
            .select(columnlist)
            .where(conditionkey)
            .then(result => {
                resolve(result);
            }).catch((error) => {
                reject(error);
            })
    });
}

let selectwithcondparam = (tablemap, columnlist, conditionkey, conditionvalue, conditionparam) => {
    return new Promise((resolve, reject) => {
        tablemap
            .query()
            .select(columnlist)
            .where(conditionkey, conditionparam, conditionvalue)
            .then(result => {
                resolve(result);
            }).catch((error) => {
                reject(error);
            })
    });
}

// common join statement with where in
let commonjoin = (tablemap, columnlist, joinrelationtable, conditionvalue) => {
    return new Promise((resolve, reject) => {
        tablemap.query()
            .select(columnlist)
            .leftJoinRelation(joinrelationtable)
            .whereRaw(conditionvalue)
            .then(result => {
                resolve(result);
            }).catch((error) => reject(error))
    })
};

// common join statement with where in
let commonjoinwithalaias = (tablemap, columnlist, joinrelationtable, conditionvalue, aliasM) => {
    return new Promise((resolve, reject) => {
        console.log(tablemap.query()
            .select(columnlist)
            .joinRelation(joinrelationtable)
            .whereRaw(conditionvalue)
            .alias(aliasM).toString());
        tablemap.query()
            .select(columnlist)
            .joinRelation(joinrelationtable)
            .whereRaw(conditionvalue)
            .alias(aliasM)
            .then(result => {
                resolve(result);
            }).catch((error) => reject(error))
    })
};

// common join statement where
let commonjoinwithwhere = (tablemap, columnlist, joinrelationtable, conditionkey, conditionvalue) => {
    return new Promise((resolve, reject) => {
        tablemap.query()
            .select(columnlist)
            .joinRelation(joinrelationtable)
            .where(conditionkey, conditionvalue)
            .then(result => {
                resolve(result);
            }).catch((error) => {
                return reject(error);
            })
    })
};

// delete operation
let deletewithcond = (tablemap, conditionkey, conditionvalue) => {
    return new Promise((resolve, reject) => {
        tablemap
            .query()
            .delete()
            .where(conditionkey, conditionvalue)
            .then(result => {
                resolve(result);
            }).catch((error) => {
                reject(error);
            })
    });
}

// delete operation with transaction
let deletewithcondtrx = (tablemap, conditionkey, trx) => {
    return new Promise((resolve, reject) => {
        tablemap
            .query()
            .delete()
            .where(conditionkey).transacting(trx)
            .then(result => {
                resolve(result);
            }).catch((error) => {
                reject(error);
            })
    });

}

// function to select the data from table with where in conditon
let selectwithincond = (tablemap, columnlist, conditionkey, conditionin, conditionvalue) => {
    return new Promise((resolve, reject) => {
        tablemap
            .query()
            .select(columnlist)
            .where(conditionkey)
            .whereIn(conditionin, conditionvalue)
            .then(result => {
                resolve(result);
            }).catch((error) => {
                reject(error);
            })
    });
}

// function to select the data from table with where in conditon without where
let selectwithinwherecond = (tablemap, columnlist, conditionin, conditionvalue, alias) => {
    return new Promise((resolve, reject) => {
        tablemap
            .query()
            .select(columnlist)
            .whereIn(conditionin, conditionvalue)
            .alias(alias)
            .then(result => {
                resolve(result);
            }).catch((error) => {
                reject(error);
            })
    });

}

// function to select the data from table with where and orwhere conditon
let selectwithorcondparams = (tablemap, columnlist, conditionkey, conditionvalue, orconditionkey, orconditionvalue, conditionparam) => {
    return new Promise((resolve, reject) => {
        tablemap
            .query()
            .select(columnlist)
            .where(conditionkey, conditionparam, conditionvalue)
            .orWhere(orconditionkey, orconditionvalue)
            .then(result => {
                resolve(result);
            }).catch((error) => {
                reject(error);
            })
    });
}

// update with multiple update condtion
let updatemultiple = (tablemap, colname, condkey) => {
    return new Promise((resolve, reject) => {
        tablemap.query()
            .update(colname)
            .where(condkey)
            .then(result => {
                resolve(result);
            }).catch(error => {
                reject(error);
            })
    })
};


// delete operation whth where in condition
let deletewithwherincond = (tablemap, wherecondition, conditionin, conditionvalue) => {
    return new Promise((resolve, reject) => {
        let mod = tablemap
            .query()
            .delete()
            .whereRaw(wherecondition)
        if (conditionvalue) {
            mod = mod.whereIn(conditionin, conditionvalue)
        }
        mod.then(result => {
            resolve(result);
        }).catch((error) => {
            reject(error);
        })
    });

}

// common join statement where with alias
let commonjoinwithwherealias = (tablemap, columnlist, joinrelationtable, conditionkey, conditionvalue, alias) => {
    return new Promise((resolve, reject) => {
        tablemap.query()
            .alias(alias)
            .select(columnlist)
            .leftJoinRelation(joinrelationtable)
            .where(conditionkey, conditionvalue)
            .then(result => {
                resolve(result);
            }).catch((error) => reject(error))
    })
};

// common join statement where with alias
let commonjoinwithwherevaluealias = (tablemap, columnlist, joinrelationtable, conditionkey, alias) => {
    return new Promise((resolve, reject) => {
        tablemap.query()
            .alias(alias)
            .select(columnlist)
            .leftJoinRelation(joinrelationtable)
            .where(conditionkey)
            .then(result => {
                resolve(result);
            }).catch((error) => reject(error))
    })
};

// common join statement where
let commonjoinwithwhereorderby = (tablemap, columnlist, joinrelationtable, conditionkey, orderbycond, alias) => {
    return new Promise((resolve, reject) => {
        tablemap.query()
            .alias(alias)
            .select(columnlist)
            .leftJoinRelation(joinrelationtable)
            .whereRaw(conditionkey)
            .orderBy(orderbycond)
            .then(result => {
                resolve(result);
            }).catch((error) => {
                return reject(error);
            })
    })
};

let commonleftjoin = (tablemap, columnlist, joinrelationtable, alias) => {
    return new Promise((resolve, reject) => {
        tablemap.query()
            .alias(alias)
            .select(columnlist)
            .leftJoinRelation(joinrelationtable)
            .then(result => {
                resolve(result);
            }).catch((error) => {
                return reject(error);
            })
    })
};

let multipleUpdate = (tablemap, colname, condkey) => {
    return new Promise((resolve, reject) => {
        tablemap.query()
            .update(colname)
            .whereRaw(condkey)
            .then(result => {
                resolve(result);
            }).catch(error => {
                reject(error);
            })
    })
};

module.exports = {
    insertTable,
    simpleselect,
    selectquery,
    selectquerywithwhere,
    selectwithWherecondandgroupby,
    selectwithcond,
    selectwithcondparam,
    commonjoin,
    commonjoinwithalaias,
    commonjoinwithwhere,
    deletewithcond,
    deletewithcondtrx,
    selectwithincond,
    selectwithinwherecond,
    selectwithorcondparams,
    updatemultiple,
    deletewithwherincond,
    commonjoinwithwherealias,
    commonjoinwithwherevaluealias,
    commonjoinwithwhereorderby,
    commonleftjoin,
    multipleUpdate
};