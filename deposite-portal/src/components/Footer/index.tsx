import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import './Footer.scss';
import { ImageData } from 'src/resources/images';
import SearchIcon from '@mui/icons-material/Search';
import { Button } from '@mui/material';
import { ALBA_CONSTANTS } from 'src/resources/constants';

export const Footer: React.FC = () => {
  return (
    <>
      <Box
        sx={{
          backgroundColor: '#00e2d6',
          padding: {
            xs: '30px 0',
            sm: '50px 0',
            md: '60px 0'
          }
        }}
      >
        <Box
          className="container"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontFamily: 'Merriweather',
              fontSize: { xs: '23px', md: '35px', lg: '44px' },
              fontWeight: 700,
              textAlign: 'center'
            }}
          >
            We're here to help
          </Typography>
          {/* <Typography
            sx={{
              fontSize: "23px",
              lineHeight: "32px",
              fontWeight: 300,
              marginTop: "10px",
              textAlign: "center",
            }}
          >
            Alba Bank - For the next step on your business journey.
          </Typography> */}
          <Button
            href="https://www.albabank.co.uk/contact/"
            sx={{
              color: '#221c35',
              fontSize: '16px',
              lineHeight: '24px',
              fontWeight: 400,
              marginTop: '15px',
              textTransform: 'none',
              padding: '2px 0',
              background: 'transparent !important',
              borderBottom: '1px solid #221c35 !important'
            }}
          >
            Talk to us today
          </Button>
        </Box>
      </Box>
      <div className="footer">
        <div className="container">
          <div className="row">
            <div className="footer-item   col-lg-3 col-md-5 col-12 col">
              <div className="item  item_text-below text-left " data-os-animation="" data-os-animation-delay="">
                <div className="inner  ">
                  <div className="info info_align-bottom">
                    <p className="heading footer-heading">Alba Bank Limited</p>
                    <div className="text footer-text">
                      <p>
                        5 Redwood Crescent
                        <br />
                        East Kilbride&nbsp;
                        <br />
                        G74 5PA
                      </p>
                      <p>
                        <a href={'mailto:' + ALBA_CONSTANTS.ENQUIRIES_MAIL_ID}>{ALBA_CONSTANTS.ENQUIRIES_MAIL_ID}</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer-item offset-lg-1 offset-md-1 col-lg-4 col-md-6 col-12 col">
              <div className="item  item_search-links">
                <div className="inner">
                  <p className="heading footer-heading">Browse the site</p>
                  <div className="site-search">
                    <form
                      role="search"
                      action="https://www.albabank.co.uk/search-results/"
                      method="get"
                      name="searchForm"
                    >
                      <fieldset>
                        <div className="form-group">
                          <label className="control-label d-none" htmlFor="search_field">
                            Search the site
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="search_field"
                            aria-label="Search the site"
                            placeholder="Search the site"
                          />
                        </div>
                        <button
                          type="button"
                          aria-label="Search"
                          className="btn base-btn-bg base-btn-text base-btn-borders btn-search"
                        >
                          <SearchIcon />
                        </button>
                      </fieldset>
                    </form>
                  </div>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between'
                    }}
                  >
                    <nav className="quick-links">
                      <ul>
                        <li>
                          <a href="https://www.albabank.co.uk/">Home</a>
                        </li>

                        <li>
                          <a href="https://www.albabank.co.uk/our-journey/">Our Journey</a>
                        </li>
                        <li>
                          <a href="https://www.albabank.co.uk/who-we-are/">Who We Are</a>
                        </li>
                        <li>
                          <a href="https://www.albabank.co.uk/people/">Our People</a>
                        </li>

                        <li>
                          <a href="https://www.albabank.co.uk/news/">News</a>
                        </li>
                        <li>
                          <a href="https://www.albabank.co.uk/contact/">Contact</a>
                        </li>
                      </ul>
                    </nav>
                  </Box>
                </div>
              </div>
            </div>
            <div className="footer-item offset-lg-1  col-lg-3 col-md-12 col-12 col">
              <Box
                className="inner"
                sx={{
                  display: 'flex',
                  flexDirection: 'row'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    padding: 1.8
                  }}
                >
                  <a
                    href={ALBA_CONSTANTS.LINKEDIN_URL}
                    target="_blank"
                    title="Link will open in a new window/tab"
                    className="imageLoaded"
                  >
                    <img
                      className="linkedIn"
                      src={ImageData.linkedImage}
                      data-src={ImageData.linkedImage}
                      alt="linkedin"
                    />
                  </a>
                </Box>
                <Box
                  sx={{
                    display: 'flex'
                  }}
                >
                  <a
                    href={ALBA_CONSTANTS.FSCS_URL}
                    target="_blank"
                    title="Link will open in a new window/tab"
                    className="imageLoaded"
                  >
                    <img
                      className="fscs"
                      src={ImageData.FSCS_Protected}
                      data-src={ImageData.FSCS_Protected}
                      alt="albabank"
                    />
                  </a>
                </Box>
              </Box>
            </div>
            <div className="footer-item col-12 col">
              <div className="item  item_text-below text-left " data-os-animation="" data-os-animation-delay="">
                <div className="inner  ">
                  <div className="info info_align-bottom">
                    <div className="text footer-text">
                      <p>
                        Alba Bank Limited is a company registered in Scotland (company number SC586124) and its
                        registered office is: Redwood House, 5 Redwood Crescent, Peel Park, East Kilbride, South
                        Lanarkshire, Scotland, G74 5PA. Alba Bank Limited is authorised by the Prudential Regulation
                        Authority and regulated by the Financial Conduct Authority and the Prudential Regulation
                        Authority (Financial Services Register number 849944).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <nav className="footer-navigation">
                <ul style={{ paddingLeft: 0 }}>
                  <li>
                    <div>© {ALBA_CONSTANTS.COPYRIGHT_YEAR}</div>
                  </li>
                  <li>
                    <a href="https://www.albabank.co.uk/sitemap/">Sitemap</a>
                  </li>
                  <li>
                    <a href="https://www.albabank.co.uk/privacy-policy/">Privacy Policy</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
