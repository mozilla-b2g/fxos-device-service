let request = require('../request');

suite('GET /processes', () => {
  test('should get many', async function() {
    let res = await request('GET', 3000, '/processes');
    let procs = JSON.parse(res.body);
    res.statusCode.should.equal(200);
    procs.length.should.equal(11);
    procs[0].pid.should.equal(2806);
    procs[10].pid.should.equal(14916);
  });

  test('should get single', async function() {
    let res = await request('GET', 3000, '/processes/4669');
    let proc = JSON.parse(res.body);
    res.statusCode.should.equal(200);
    proc.name.should.equal('Camera');
    proc.pid.should.equal(4669);
    proc.ppid.should.equal(2813);
    proc.cpus.should.equal(9.1);
    proc.nice.should.equal(0);
    proc.uss.should.equal(14.055);
    proc.pss.should.equal(16.331);
    proc.rss.should.equal(34.980);
    proc.swap.should.equal(0);
    proc.vsize.should.equal(136.496);
    proc.oomadj.should.equal(6);
    proc.user.should.equal('u0_a4669');
  });
});

suite('DELETE /processes/:pid', () => {
  test('should succeed', async function() {
    let res = await request('DELETE', 3000, '/processes/1234');
    res.statusCode.should.equal(200);
  });
});
