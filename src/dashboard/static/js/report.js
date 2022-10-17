window.onload = () => {

    if (window.location.search.includes('full-screen=true')) document.body.classList.add('full-screen');
    const loader = window.top.document.querySelector('.loader');
    if (loader) loader.style.display = 'none';
    document.querySelector('form').addEventListener('submit', e => {
        e.preventDefault();

        let reported_name = document.getElementsByName('reported_name')[0], 
        reported_id = document.getElementsByName('reported_id')[0], 
        report = document.getElementsByName('report')[0],
        proof = document.getElementsByName('proof')[0];



        if (!report || !report.value) return report.focus();

const understand = document.getElementById("checkboxL");


  if (understand.checked == true){
var v = grecaptcha.getResponse();
if(v.length == 0){
    document.getElementById('captcha').innerHTML="Intento de Captcha no válido.";
    return false;
}
 if(v.length != 0){;
  
 

        document.body.classList.add('done');
        fetch('/report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'report',
                name: username || 'nombre no dado',
                id: userID || 'no provisto',
                reported_user: reported_name.value,
                reported_id: reported_id.value,
                reason: report.value,
                proof: proof.value,
            })
        })
            .then(res => res.ok && document.body.classList.add('hecho'));
 }

} else {

   document.getElementById('iunderstand').innerHTML="Campos Faltantes";
   return false;

}
    });
    
}

  