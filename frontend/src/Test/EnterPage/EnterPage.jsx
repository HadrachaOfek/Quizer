import './EnterPage.css'
import ofekLogo from '../resources/images/ofek.png';
import hadrachaLogo from '../resources/images/hadracha.png'
import { TextField, Button } from '@mui/material'

function EnterPage() {
  return (
    <div id='enter-page'>
      <div id='enter-page-header'>
        <img className='ofek' src={ofekLogo} alt='' />
        <h1>אתר מבחנים</h1>
        <img className='hadracha' src={hadrachaLogo} alt='' />
      </div>

      <div id='identification'>
        <TextField dir='rtl' id="standard-basic" label="מספר אישי" variant="standard" />
        <TextField id="standard-basic" label="קוד מבחן" variant="standard" />
      </div>

      <div id='connection'>
        <Button variant="contained">Contained</Button>
      </div>

    </div>
  )
}

export default EnterPage;
