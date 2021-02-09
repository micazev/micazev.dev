import React from 'react'
import { Link } from 'gatsby'

import logo from '../img/logo.svg'
import facebook from '../img/social/facebook.svg'
import instagram from '../img/social/instagram.svg'
import twitter from '../img/social/twitter.svg'
import vimeo from '../img/social/vimeo.svg'

const Footer = class extends React.Component {
  render() {
    return (
      <footer className="footer has-background-black has-text-white-ter">
        <div className="content has-background-black has-text-white-ter">
          <div className="container has-background-black has-text-white-ter">
            <div style={{ maxWidth: '100vw' }} className="columns">
              <div className="column is-5">
               <b>Michelle Azevedo</b>
               <p>Eu sou a Mi, @micazev no mundo online. Desenvolvo automações de processos, principalmente usando o software UiPath, 
                 mas curso muito o mundo front end. Nesse site eu escrevo pequenos tutoriais sobre programação.
               </p>
                
              </div>
              <div className="column is-3 social">
               <b>Newsletter</b>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }
}

export default Footer
