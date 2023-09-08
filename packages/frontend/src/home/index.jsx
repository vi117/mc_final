import { Carousel, Button, Container, Form, Nav, Navbar, NavDropdown, InputGroup, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { React, useState } from 'react';
import { HambergerMenu, ProfileCircle } from 'iconsax-react';

export function HomePage() {
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="logo">
          <img src="../public/logo2.svg" style={{ height: '16px', margin: '30px', display: 'flex' }}></img>
        </div>

        <div>
          <p className="loginBtn"
            style={{
              display: 'inline-flex', border: '1px solid #555555', height: '40px',
              fontSize: '12px', borderRadius: '4px', padding: '10px', margin: '30px', alignItems: 'center'
            }}>
            <ProfileCircle color="#555555" variant="Bulk" style={{ marginRight: '5px' }} />
            로그인/회원가입
          </p>
        </div>
      </div>
      <Navbar expand="lg" className="bg-white" style={{ borderBottom: '1px solid #F0F0F0', boxShadow: 'rgba(0, 0, 0, 0.08) 0px 1px 6px' }}>
        <Container fluid >
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll" >
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px', marginLeft: '10px' }}
              navbarScroll
            >
              <Nav.Link href="#action1"><HambergerMenu color="#555555" /></Nav.Link>
              <Nav.Link href="/">홈</Nav.Link>
              <Nav.Link href="#action2">카테고리</Nav.Link>
              <NavDropdown title="펀딩" id="navbarScrollingDropdown">
                <NavDropdown.Item href="#action3">펀딩 카테고리1</NavDropdown.Item>
                <NavDropdown.Item href="#action4">펀딩 카테고리2</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="/community">커뮤니티</Nav.Link>
            </Nav>
            <Navbar className="bg-white" style={{ justifyContent: 'flex-end' }}>
              <Form inline>
                <Row>
                  <Col xs="auto">
                    <Form.Control
                      type="text"
                      placeholder="검색어를 입력해주세요"
                      className=" mr-sm-2"
                    />
                  </Col>
                  <Col xs="auto">
                    <Button type="submit">Submit</Button>
                  </Col>
                </Row>
              </Form>
            </Navbar>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="banner">
        <Carousel activeIndex={index} onSelect={handleSelect}>
          <Carousel.Item>
            <img src="../public/sample.png" style={{ height: '375px', objectFit: 'fill' }}></img>
            <Carousel.Caption>
              <h3>First slide label</h3>
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img src="../public/sample.png" style={{ height: '375px', objectFit: 'fill' }}></img>
            <Carousel.Caption>
              <h3>Second slide label</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img src="../public/sample.png" style={{ height: '375px', objectFit: 'fill' }}></img>
            <Carousel.Caption>
              <h3>Third slide label</h3>
              <p>
                Praesent commodo cursus magna, vel scelerisque nisl consectetur.
              </p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
    </div>
  )
}

export default HomePage;
