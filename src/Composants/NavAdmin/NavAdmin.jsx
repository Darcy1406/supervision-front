import './NavAdmin.css';

export default function NavAdmin() {
  return (
    <div id='navigation-admin'>
        <p className='is-pulled-right mx-4 text-lg' style={{lineHeight: '40px'}}>
            <span className='icon'>
                <i className="fas fa-user"></i>
            </span>
            Bienvenue Admin !
        </p>
    </div>
  )
}
