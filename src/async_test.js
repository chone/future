
var Future = async.Future;
var Completer = async.Completer;

var asyncTest = new AsyncTest();


var completer;

function setUp() {
  completer = new Completer();
}

function testThen() {
  completer.future.then(function(value) {
    asyncTest.wait()
    assertEquals(value, 10);
  });
  completer.complete(10);

  setUp();
  completer.future.then(function(value) {
    asyncTest.wait()
    assertUndefined(value);
  });
  completer.complete();

  setUp();
  completer.future.then(function(value) {
    assertNull(value);
  });
  completer.complete(null);

  setUp();
  completer.future.then(function(value) {
    asyncTest.next();
    assertEquals(value, 0);
  });
  completer.complete(0);
}

function testThenThenChain() {
  completer.future.then(function(value) {
    assertTrue(true);
    asyncTest.wait();
  }).then(function(value) {
    assertEquals(value, 10);
    asyncTest.wait();
  });
  completer.complete(10);

  setUp();
  completer.future.then(function(value) {
    assertEquals(value, 10);
    asyncTest.wait();
    return 20
  }).then(function(value) {
    assertEquals(value, 20);
    asyncTest.wait();
  });
  completer.complete(10);

  setUp();
  completer.future.then(function(value) {
    var c = new Completer();
    setTimeout(function() {
      c.complete(30)
    }, 100);
    return c.future;
  }).then(function(value) {
    assertEquals(value, 30);
    asyncTest.wait();
  });
  completer.complete(10);

  setUp();
  completer.future.then(function(value) {
    throw Error('test');
  }).then(function(value) {
    assertTrue(false);
  }).catchError(function() {
    asyncTest.next();
  });
  completer.complete(10);
}

function testThenCatchErrorChain() {
  completer.future.then(function() {
  }).catchError(function() {
    assertTrue(false);
    asyncTest.wait();
  });
  completer.complete(1);

  setUp();
  completer.future.then(function() {
    return 10;
  }).catchError(function() {
    assertTrue(false);
    asyncTest.wait();
  });
  completer.complete(1);

  setUp();
  completer.future.then(function() {
    throw Error('test');
  }).catchError(function(e) {
    assertEquals(e.message, 'test');
    asyncTest.wait();
  });
  completer.complete(1);

  setUp();
  completer.future.then(function() {
    var c = new Completer();
    setTimeout(function() {
      c.complete(10);
    }, 100);
    return c.future;
  }).catchError(function() {
    assertTrue(false);
    asyncTest.wait();
  });
  completer.complete(1);

  setUp();
  completer.future.then(function() {
    var c = new Completer();
    setTimeout(function() {
      c.completeError(Error('test1'));
    }, 100);
    return c.future;
  }).catchError(function(e) {
    assertEquals(e.message, 'test1');
    asyncTest.next();
  });
  completer.complete(1);
}

function testCatchError() {
  completer.future.catchError(function(e) {
    assertEquals(e.message, 'test1');
    asyncTest.wait();
  });
  completer.completeError(Error('test1'));

  setUp();
  completer.future.catchError(function(e) {
    assertTure(false);
    asyncTest.wait();
  }).then(function() {
    asyncTest.next();
  });
  completer.complete(1);
}

function testCatchErrorThenChain() {
  completer.future.catchError(function(){}).then(function() {
    assertTrue(false);
    asyncTest.wait();
  });
  completer.completeError(Error('test1'));

  setUp();
  completer.future.catchError(function(e) {
    return 1;
  }).then(function(value) {
    assertEquals(value, 1);
    asyncTest.wait();
  });
  completer.completeError(Error('test2'));

  setUp();
  completer.future.catchError(function(e) {
    var c = new Completer();
    setTimeout(function() {
      c.complete(2);
    }, 100);
    return c.future;
  }).then(function(value) {
    assertEquals(value, 2);
    asyncTest.wait();
  });
  completer.completeError(Error('test3'));

  setUp();
  completer.future.catchError(function(e) {
    var c = new Completer();
    setTimeout(function() {
      c.completeError(Error('test5'));
    }, 100);
    return c.future;
  }).then(function(value) {
    assertTrue(false);
    asyncTest.wait();
  }).catchError(function(e) {
    assertEquals(e.message, 'test5');
    asyncTest.wait();
  });
  completer.completeError(Error('test4'));


  setUp();
  completer.future.catchError(function() {
    assertTrue(false);
    asyncTest.wait();
  }).then(function(value) {
    assertEquals(value, 3);
    asyncTest.next();
  });
  completer.complete(3);
}

function testCatchErrorCatchErrorChain() {
  completer.future.catchError(function() {
  }).catchError(function(e) {
    asyncTest.wait();
  });
  completer.completeError(Error('test1'));

  setUp();
  completer.future.catchError(function() {
    asyncTest.wait();
    throw Error('test3');
  }).catchError(function(e) {
    assertEquals(e.message, 'test3');
    asyncTest.next();
  });
  completer.completeError(Error('test2'));

  setUp();
  completer.future.catchError(function() {
    return 1;
  }).catchError(function(e) {
    asyncTest.wait();
  });
  completer.completeError(Error('test2'));

  setUp();
  completer.future.catchError(function() {
    var c = new Completer();
    setTimeout(function() {
      c.complete(1);
    }, 100);
    return c.future;
  }).catchError(function(e) {
    asyncTest.wait();
  });
  completer.completeError(Error('test2'));

  setUp();
  completer.future.catchError(function() {
    var c = new Completer();
    setTimeout(function() {
      c.completeError(Error('test3'));
    }, 100);
    asyncTest.wait('step 1');
    return c.future;
  }).catchError(function(e) {
    assertEquals(e.message, 'test3');
    asyncTest.next();
  });
  completer.completeError(Error('test2'));

}


