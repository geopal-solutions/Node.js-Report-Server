var assert = require('assert');
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../index');
const should = chai.should();

chai.use(chaiHttp);

describe('Server', function() {
  describe('/status', function() {
    it('should return \'ok\'', function(done) {
      chai.request(app)
          .get('/status')
          .end(function(err, res) {
            res.text.should.equal('ok');
            done();
          });
    });
  });

  describe('/pdf-report', function() {
    it('base64 report with one chart with custom container id', function(done) {
      this.timeout(3000);

      chai.request(app)
          .post('/pdf-report')
          .send({
            "response_type": "base64",
            "data": "(function() {return {content: [{\"chart\": {\"data\": \"chart = anychart.line([1,2,3]); chart.container('custom_container_id').draw();\",\"dataType\": \"javascript\",\"containerId\": \"custom_container_id\"},\"fit\": [500, 500]}]}})();"
          })
          .end(function(err, res) {
            res.should.to.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('data');
            done();
          });
    });
  });

  describe('/vector-image', function() {
    it('javascript data to pdf document as base64 string', function(done) {
      this.timeout(3000);

      chai.request(app)
          .post('/vector-image')
          .send({
            "background": "#f00",
            "aspect-ratio": true,
            "width": 200,
            "height": 1000,
            "data_type": "javascript",
            "file_type": "pdf",
            "response_type": "base64",
            "data": "var chart = anychart.pie(); chart.data([10, 20, 8, 5, 12, 9]); chart.container('container'); chart.draw();"
          })
          .end(function(err, res) {
            res.should.to.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('data');
            done();
          });
    });

    it('xml data to ps image as file', function(done) {
      this.timeout(3000);

      chai.request(app)
          .post('/raster-image')
          .send({
            "file_name": "chart.ps",
            "data_type": "xml",
            "file_type": "ps",
            "response_type": "file",
            "data": '<anychart xmlns="http://anychart.com/schemas/7.14.3/xml-schema.xsd"><chart enabled="true" type="venn"><title enabled="true" text="Cooking Bacon by Venn Diagram"><padding left="0" top="0" bottom="35" right="0"/></title><credits text="AnyChart" url="https://www.anychart.com/?utm_source=registered" alt="AnyChart - JavaScript Charts designed to be embedded and integrated" img_alt="AnyChart - JavaScript Charts" logo_src="https://static.anychart.com/logo.png" enabled="false"/><select_marquee_fill color="#d3d3d3" opacity="0.4"/><legend enabled="true"><padding left="0" top="35" bottom="0" right="0"/></legend><stroke color="#fff" thickness="2"/><data><point x="A" value="100" name="Salt" fill="#c6c6c6 0.75"><label font_color="#60727b"/></point><point x="B" value="100" name="Meat" fill="#e24b26 0.75"><label font_color="#ffdb69"/></point><point x="C" value="100" name="Fat" fill="#ffdb69 0.75"><label font_color="#60727b"/></point><point x="D" value="100" name="Smoke" fill="#60727b 0.75"><label font_color="#ffdb69"/></point><point value="35" name="Corned Beef"><x><![CDATA[A&B]]></x></point><point value="35" name="Pork Belly"><x><![CDATA[B&C]]></x></point><point value="35" name="Cuban Cigar"><x><![CDATA[C&D]]></x></point><point value="35" name="Smoked Salt"><x><![CDATA[A&D]]></x></point><point value="35" name="Bacon!"><x><![CDATA[A&B&C&D]]></x><label font_size="14"/></point></data><labels enabled="true" font_size="14"/><intersections><labels font_color="#fff" font_weight="bold" format="{%Name}"/><tooltip z_index="0"/></intersections></chart></anychart>'
          })
          .end(function(err, res) {
            res.should.to.have.status(200);
            res.should.to.have.header('content-type', 'application/postscript');
            res.should.to.have.header('content-disposition', 'attachment; filename=chart.ps');
            done();
          });
    });
  });

  describe('/raster-image', function() {
    it('javascript data to png image as base64 string', function(done) {
      this.timeout(3000);

      chai.request(app)
          .post('/raster-image')
          .send({
            "data_type": "javascript",
            "file_type": "png",
            "response_type": "base64",
            "data": "var chart = anychart.pie(); chart.data([10, 20, 8, 5, 12, 9]); chart.container('container'); chart.draw();"
          })
          .end(function(err, res) {
            res.should.to.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('data');
            done();
          });
    });

    it('json data to jpg image as file', function(done) {
      this.timeout(3000);

      chai.request(app)
          .post('/raster-image')
          .send({
            "file_name": "chart.jpg",
            "data_type": "json",
            "file_type": "jpg",
            "response_type": "file",
            "data": '{"chart":{"enabled":true,"padding":{"left":35,"top":35,"bottom":35,"right":35},"credits":{"text":"AnyChart","url":"https://www.anychart.com/?utm_source=registered","alt":"AnyChart - JavaScript Charts designed to be embedded and integrated","imgAlt":"AnyChart - JavaScript Charts","logoSrc":"https://static.anychart.com/logo.png","enabled":false},"selectMarqueeFill":{"color":"#d3d3d3","opacity":0.4},"xScale":0,"yScale":1,"series":[{"enabled":true,"seriesType":"marker","tooltip":{"enabled":false},"labels":{"enabled":true,"fontFamily":"Arial","fontColor":"#546e7a","format":"{%Name}","position":"right","anchor":"leftCenter","offsetX":5,"offsetY":0},"data":[{"x":65,"y":60,"name":"Tableau","logo":"tableau.png","description_short":"Data visualization company","website":"tableau.com","description":"Tableau Software is an American computer software company headquartered in Seattle, Washington. It produces a family of interactive data visualization products focused on business intelligence.","stock_price_today":55.71,"stock_price_change":-0.31,"stock_price_change_percent":-0.55,"founded":"January 2003","founders":"Pat Hanrahan, Christian Chabot, Chris Stolte","CEO":"Adam Selipsky","CFO":"Tom Walker","headquarters":"Seattle, Washington, United States","stock_price_key_data":"DATA.US"},{"x":68,"y":57,"name":"Qlik","logo":"qlik.png","description_short":"Software company","website":"qlik.com","description":"Qlik is a software company based in Radnor, Pennsylvania, United States. Qlik is the provider of QlikView and Qlik Sense, business intelligence & visualization software.","stock_price_today":null,"stock_price_change":null,"founded":"1993","founders":"Björn Berg, Staffan Gestrelius","CEO":"Lars Björk","CFO":"Tim MacCarrick","headquarters":"Radnor, Pennsylvania, United States","stock_price_key_data":"QLIK.US"},{"x":78,"y":55,"name":"Microsoft","logo":"microsoft.png","description_short":"Technology company","website":"microsoft.com","description":"Microsoft Corporation (commonly referred to as Microsoft or MS) is an American multinational technology company headquartered in Redmond, Washington, that develops, manufactures, licenses, supports and sells computer software, consumer electronics and personal computers and services.","stock_price_today":57.24,"stock_price_change":-0.18,"stock_price_change_percent":-0.31,"founded":"April 4, 1975","founders":"Bill Gates, Paul Allen","CEO":"Satya Nadella","CFO":"Amy Hood","headquarters":"Redmond, Washington, United States","stock_price_key_data":"MSFT.US"},{"x":65.5,"y":48,"name":"Alteryx","logo":"alteryx.png","description_short":"Computer software company","website":"alteryx.com","description":"Alteryx is an American computer software company based out of Irvine, California, with a development center in Broomfield, Colorado. The company\'s products are used for data blending and advanced data analytics.","stock_price_today":null,"stock_price_change":null,"founded":"2010","founders":"Dean Stoecker, Olivia Duane Adams, Ned Harding","CEO":"Dean Stoecker ","CFO":"Kevin Rubin","headquarters":"\tIrvine, California, U.S.","stock_price_data":null},{"x":63,"y":47,"name":"SAS","label":{"anchor":"right"},"logo":"sas.jpeg","description_short":"Software company","website":"www.sas.com","description":"SAS Institute is an American multinational developer of analytics software based in Cary, North Carolina. SAS develops and markets a suite of analytics software, which helps access, manage, analyze and report on data to aid in decision-making.","stock_price_today":null,"stock_price_change":null,"founded":"July 1, 1976","founders":"James Goodnight, Anthony James Barr, John Sall","CEO":"James Goodnight","CFO":null,"CTO":"Oliver Schabenberger","headquarters":"Cary, North Carolina, United States","stock_price_key_data":"SAS.ST"},{"x":64,"y":43,"name":"SAP","logo":"sap.jpeg","description_short":"Software company","website":"go.sap.com","description":"SAP SE is a German multinational software corporation that makes enterprise software to manage business operations and customer relations. SAP is headquartered in Walldorf, Baden-Württemberg, Germany, with regional offices in 130 countries.","stock_price_today":81.28,"stock_price_change":-0.19,"stock_price_change_percent":-0.23,"founded":"April 1, 1972","founders":"Dietmar Hopp, Hans-Werner Hector, Hasso Plattner, Klaus Tschira, Claus Wellenreuther","CEO":"Bill McDermott","CFO":"Luka Mucic","headquarters":"Walldorf, Germany","stock_price_key_data":"SAP.US"},{"y":28,"name":"IBM","label":{"anchor":"bottom","offsetX":0},"logo":"ibm.png","description_short":"Computer hardware company","website":"ibm.com","description":"International Business Machines Corporation is an American multinational technology company headquartered in Armonk, New York, United States, with operations in over 170 countries.","stock_price_today":157.08,"stock_price_change":0.62,"stock_price_change_percent":0.4,"founded":"June 16, 1911","founders":"Charles Ranlett Flint","CEO":"Ginni Rometty","CFO":null,"headquarters":"Armonk, North Castle, New York, United States","stock_price_key_data":"IBM.US"},{"x":51,"y":21,"name":"TIBCO Software","logo":"tibco.png","description_short":"Software company","website":"tibco.com","description":"TIBCO Software Inc. is an American company that provides integration, analytics and events processing software for companies to use on-premises or as part of cloud computing environments.","stock_price_today":null,"stock_price_change":null,"founded":"1997","founders":"Dale Skeen, Vivek Ranadivé","CEO":"Murray D. Rode","CFO":"Tom Berquist","headquarters":"Palo Alto, California, United States","stock_price_data":null},{"x":53.2,"y":25.8,"name":"Pentaho","label":{"anchor":"right"},"logo":"pentaho.png","description_short":null,"website":"pentaho.com","description":"Pentaho is a company that offers Pentaho Business Analytics, a suite of open source Business Intelligence products which provide data integration, OLAP services, reporting, dashboarding, data mining and ETL capabilities.","stock_price_today":null,"stock_price_change":null,"founded":"2004","founders":"Richard Daley","CEO":"Quentin Gallivan ","CTO":"James Dixon","CFO":null,"headquarters":"Orlando, Florida, United States","stock_price_data":null},{"x":47,"y":48,"name":"Birst","label":{"anchor":"right"},"logo":"birst.jpeg","description_short":"Cloud BI and analytics","website":"www.birst.com","description":"Birst is a global leader in cloud BI and analytics. The company helps organizations make thousands of decisions better, every day, for every person. Birst’s patented two-tier data architecture and comprehensive BI platform sits on top of all of your data, to unify, refine and embed data consistently into every individual decision—up and down the org chart. ","stock_price_today":null,"stock_price_change":null,"founded":"2004","founders":"Brad Peters, Paul Staelin","CEO":"Jay Larson","CFO":"Sam Wolff","headquarters":"San Francisco, CA","stock_price_data":null},{"x":37,"y":43,"name":"Domo","label":{"anchor":"right"},"logo":"domo.png","description_short":"Business Intelligence: Dashboards, Reporting and Analytics","website":"www.domo.com","description":"Domo, Inc. is an American computer software company based in American Fork, Utah, USA. It specializes in business intelligence tools and data visualization.","stock_price_today":null,"stock_price_change":null,"founded":"2010","founders":"Josh James","CEO":"Josh James","CFO":null,"headquarters":"American Fork, Utah, US","stock_price_data":null},{"y":27.5,"name":"Board International","label":{"anchor":"leftTop","offsetX":-10,"offsetY":3},"logo":"boardInternational.png","description_short":"Business intelligence company","website":"board.com","description":"BOARD International S.A. is a Business Intelligence and Corporate Performance Management software vendor known for its BOARD toolkit. The company is headquartered in Lugano, Switzerland, where it was founded in 1994.","stock_price_today":null,"stock_price_change":null,"founded":"1994","founders":null,"CEO":null,"CFO":null,"headquarters":"Lugano, Switzerland","stock_price_data":null},{"x":35,"y":26.5,"name":"Sisense","label":{"anchor":"rightBottom"},"logo":"sisense.png","description_short":"Software company","website":"sisense.com","description":"Sisense is a business analytics software company with offices in New York City and Tel Aviv. Its business intelligence product includes both a back-end powered by in-chip technology that enables non-technical users to join and analyze large data sets from multiple sources, and a front-end for creating visualizations, like dashboards and reports, on any device, including mobile.","stock_price_today":null,"stock_price_change":null,"founded":"2004","founders":"Elad Israeli, Eldad Farkash, Aviad Harell, Guy Boyangu, Adi Azaria","CEO":"Amir Orad","CFO":null,"headquarters":null,"stock_price_data":null},{"x":30,"y":16,"name":"Yellowfin","label":{"anchor":"right"},"logo":"yellowfin.png","description_short":"Business intelligence company","website":"yellowfinbi.com","description":"Yellowfin is a business intelligence, dashboard, reporting and data analysis software vendor. Yellowfin’s software allows reporting from data stored in relational databases, multi-dimensional cubes or in-memory analytical databases.","stock_price_today":null,"stock_price_change":null,"founded":"2003","founders":"Glen Rabie and Justin Hewitt","CEO":null,"CFO":null,"headquarters":"Melbourne, Victoria, Australia, Tokyo, Idaho, Boston, London, New Hampshire","stock_price_data":null}],"xScale":0,"yScale":1}],"isVertical":false,"quarters":{"rightTop":{"enabled":true,"title":{"enabled":true,"fontColor":"#ff8f00","text":"LEADERS","padding":{"left":10,"top":10,"bottom":10,"right":10}}},"leftTop":{"enabled":true,"title":{"enabled":true,"fontColor":"#ff8f00","text":"CHALLENGERS","padding":{"left":10,"top":10,"bottom":10,"right":10}}},"leftBottom":{"enabled":true,"title":{"enabled":true,"fontColor":"#ff8f00","text":"NICHE PLAYERS","padding":{"left":10,"top":10,"bottom":10,"right":10}},"labels":[{"enabled":true,"zIndex":20,"useHtml":true,"background":{"zIndex":0,"enabled":false,"disablePointerEvents":false},"padding":{},"anchor":"leftCenter","offsetX":-20,"text":"Power to Perform &#8594;","rotation":-90,"position":"leftBottom"},{"enabled":true,"zIndex":20,"useHtml":true,"background":{"zIndex":0,"enabled":false,"disablePointerEvents":false},"padding":{},"anchor":"leftCenter","offsetY":20,"text":"Entirety of Representation &#8594;","position":"leftBottom"}]},"rightBottom":{"enabled":true,"title":{"enabled":true,"fontColor":"#ff8f00","text":"VISIONARIES","padding":{"left":10,"top":10,"bottom":10,"right":10}}}},"type":"quadrant"}}'
          })
          .end(function(err, res) {
            res.should.to.have.status(200);
            res.should.to.have.header('content-type', 'image/jpg');
            res.should.to.have.header('content-disposition', 'attachment; filename=chart.jpg');
            done();
          });
    });
  });


  describe('/data-file', function() {
    it('csv data to xlsx file', function(done) {
      chai.request(app)
          .post('/data-file')
          .send({
            "file_name": "anychart.xlsx",
            "data": "x,value\n0,10\n1,20\n2,8\n3,5\n4,12\n5,9",
            "response_type": "file"
          })
          .end(function(err, res) {
            res.should.to.have.status(200);
            res.should.to.have.header('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.should.to.have.header('content-disposition', 'attachment; filename=anychart.xlsx');
            done();
          });
    });

    it('csv data to csv file', function(done) {
      chai.request(app)
          .post('/data-file')
          .send({
            "file_name": "anychart.csv",
            "file_type": "csv",
            "data": "x,value\n0,10\n1,20\n2,8\n3,5\n4,12\n5,9",
            "response_type": "file"
          })
          .end(function(err, res) {
            res.should.to.have.status(200);
            res.should.to.have.header('content-type', 'text/csv');
            res.should.to.have.header('content-disposition', 'attachment; filename=anychart.csv');
            done();
          });
    });
  });
});