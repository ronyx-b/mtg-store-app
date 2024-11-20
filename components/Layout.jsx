import useIsAdmin from "@/services/cache/useIsAdmin";
import { selectCartQty } from "@/services/store/cartSlice";
import { removeToken, selectDecodedToken, selectToken } from "@/services/store/tokenSlice";
import { Cloudinary } from "@cloudinary/url-gen";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Button, Container, Form, Image, Nav, Navbar, NavDropdown, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

export default function Layout({ children, ...props }) {
  const [searchString, setSearchString] = useState('');
  const cartQty = useSelector(selectCartQty);
  const token = useSelector(selectToken);
  const decodedToken = useSelector(selectDecodedToken);
  const validToken = !!token && token !== "" && !!decodedToken && !!decodedToken?._id && decodedToken?._id !== "";
  const dispatch = useDispatch();
  const router = useRouter();
  const isAdmin = useIsAdmin(token);

  const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    }
  });

  const links = [
    {
      href: "/products",
      title: "Products",
      display: true
    },
    {
      href: "/cards",
      title: "Card Search",
      display: true
    },
    {
      href: "/decklist",
      title: "Buy Decklist",
      display: true
    },
    {
      href: "/register",
      title: "Register",
      display: !validToken
    },
    {
      href: "/login",
      title: "Login",
      display: !validToken
    },
    {
      href: "/account",
      title: "Account",
      display: validToken,
      dropdown: [
        {
          href: "/account?view=profile",
          title: "Profile",
        },
        {
          href: "/account?view=address",
          title: "Address",
        },
        {
          href: "/account?view=orders",
          title: "Orders",
        },
        {
          href: "/account?view=password",
          title: "Change Password",
        },
      ]
    },
    {
      href: "/dashboard",
      title: "Dashboard",
      display: !isAdmin.isLoading && isAdmin.data
    },
    {
      href: "/cart",
      title: "Cart",
      display: true
    },
    {
      href: "#",
      title: "Log out",
      display: validToken
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(`/cards?search=${searchString}`);
    setSearchString('');
  }

  const logout = useCallback(() => {
    dispatch(removeToken());
    router.push("/");
  }, [dispatch, router]);

  useEffect(() => {
    if (decodedToken?.exp) {
      let tokenExpires = decodedToken.exp * 1000;
      let now = (new Date()).valueOf();
      if (tokenExpires < now) {
        logout();
      }
    }
  },[decodedToken?.exp, logout]);

  return (<>
    <Head>
      <title>{`MTG Store {RB}`}</title>
    </Head>
    <header>
      <Navbar bg="dark" data-bs-theme="dark" sticky="top" expand="lg">
        <Container>
          <Navbar.Brand as={Link} href="/">
            <Image src={cld.image("mtg-store/mtg-logo").toURL()} alt="MTG Store logo" height={30} style={{ marginRight: "0.5rem" }} />
            MTG Store
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto" suppressHydrationWarning={true}>
                {links.filter((link) => link.display).map((link, i) => ( link.dropdown ? 
                  <NavDropdown 
                    key={`${i}:${link.href}`}
                    title={link.title}
                    menuVariant=""
                  >
                    {link.dropdown.map((subLink, j) => (
                      <NavDropdown.Item
                        key={`${i.j}:${subLink.href}`}
                        as={Link}
                        href={subLink.href}
                        active={router.asPath.startsWith(subLink.href)}
                      >
                        {subLink.title}
                      </NavDropdown.Item>
                    ))}
                  </NavDropdown> 
                : 
                  <Nav.Link 
                    key={`${i}:${link.href}`}
                    as={Link} 
                    href={link.href} 
                    active={router.asPath.startsWith(link.href)} 
                    onClick={(e) => {
                      if (link.title === "Log out") {
                        e.preventDefault();
                        logout();
                      }
                    }}
                  >
                    {link.title}
                    {link.title === "Cart" && <>
                      <div className="position-relative d-inline-block">
                        <i className="bi bi-cart3"></i>
                        <div className="position-absolute rounded-circle bg-primary" style={{top: "-3px", right: "-5px", zIndex: "1", fontSize: "10px", width: "14px", height: "14px", textAlign: "center"}}>{cartQty}</div>
                      </div>
                    </>}
                  </Nav.Link>
                ))}
              </Nav>
              <Form className="d-flex" onSubmit={handleSubmit}>
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  value={searchString}
                  onChange={(e) => {setSearchString(e.target.value)}}
                  aria-label="Search"
                />
                <Button type="submit" variant="primary">Search</Button>
              </Form>
            </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
    <main {...props}>
      {children}
    </main>
    <footer className="bg-dark text-center text-lg-start text-white p-4">
    <Container>
        <Row className="d-flex flex-row justify-content-center">
          <div id="disclaimer" style={{color: "#999999", fontSize: "0.8em"}}>
            <p>This site is made solely for demonstration purposes and is not intended to actually sell any product or service.</p>
            <p>Portions of the site are unofficial Fan Content permitted under the Wizards of the Coast Fan Content Policy. The literal and graphical information presented on this site about Magic: The Gathering, including card images, the mana symbols, and Oracle text, is copyright Wizards of the Coast, LLC, a subsidiary of Hasbro, Inc. The site is not produced by, endorsed by, supported by, or affiliated with Wizards of the Coast.</p>
            <p>Card information is provided by Scryfall, LLC. Prices and promotional offers represent daily estimates and/or market values provided by their affiliates. Absolutely no guarantee is made for any price information. See stores for final prices and details.</p>
            <p>All other content &copy;{(new Date()).getFullYear()} Rony Boscan.</p>
          </div>
        </Row>
        <Row>
          <ul className="list-unstyled d-flex flex-row justify-content-center" style={{ fontSize: "1.5em" }}>
            <li>
              <a className="text-white px-3" href="https://github.com/ronyx-b" target="_blank" rel="noreferrer noopener">
                <i className="bi bi-github"></i>
              </a>
            </li>
            <li>
              <a className="text-white px-3" href="https://www.linkedin.com/in/ronyboscan/" target="_blank" rel="noreferrer noopener">
                <i className="bi bi-linkedin"></i>
              </a>
            </li>
            <li>
              <a className="text-white px-3" href="https://x.com/ronyx" target="_blank" rel="noreferrer noopener">
                <i className="bi bi-twitter-x"></i>
              </a>
            </li>
            <li>
              <a className="text-white px-3" href="https://portfolio-ronyx-b.vercel.app/" target="_blank" rel="noreferrer noopener">
                <i className="bi bi-file-earmark-code-fill"></i>
              </a>
            </li>
          </ul>
        </Row>
      </Container>
    </footer>
  </>);
}
