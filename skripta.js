// 1. Funkcija za upravljanje klikom na vremenske slotove (dugmiće)
function izaberiSlot(dugme, vreme) {
    var sviSlotovi = document.querySelectorAll('.slot-dugme');
    sviSlotovi.forEach(function(slot) {
        slot.classList.remove('aktivan');
    });
    
    dugme.classList.add('aktivan');
    document.getElementById('izabranoVreme').value = vreme;

    if (vreme === '21:00' || vreme === '23:00') {
        alert('Napomena: Izabrali ste termin van redovnog radnog vremena. Ovaj termin se naplaćuje po posebnoj tarifi.');
    }
}

// Čekamo da se cela stranica učita
document.addEventListener('DOMContentLoaded', function() {
    
    // 2. Efekat glatkog pojavljivanja stranice
    var glavniSadrzaj = document.getElementById('glavni-sadrzaj');
    if (glavniSadrzaj) {
        glavniSadrzaj.classList.add('vidljivo');
    }

    // 3. Automatsko zaključavanje današnjeg i svih prošlih datuma
    var kalendar = document.getElementById('datum');
    if (kalendar) {
        var sutra = new Date();
        sutra.setDate(sutra.getDate() + 1); // Pomera kalendar na sutrašnji dan
        
        var godina = sutra.getFullYear();
        var mesec = String(sutra.getMonth() + 1).padStart(2, '0');
        var dan = String(sutra.getDate()).padStart(2, '0');
        var formatiranSutrasnjiDatum = godina + '-' + mesec + '-' + dan;
        
        kalendar.setAttribute('min', formatiranSutrasnjiDatum);
    }

    // 4. Logika slanja forme, provere unosa i slanje u pozadini
    var forma = document.getElementById('kontaktForma');
    if (forma) {
        forma.addEventListener('submit', function(e) {
            e.preventDefault(); // Zaustavljamo preusmeravanje na Formspree sajt

            var ime = document.getElementById('ime').value;
            var telefon = document.getElementById('telefon').value;
            var datumVrednost = document.getElementById('datum').value;
            var vremeVrednost = document.getElementById('izabranoVreme').value;

            // Bezbednosne provere unosa na klijentskoj strani
            if (/\d/.test(ime)) {
                alert('Greška: U polje za ime i prezime ne smete unositi brojeve.');
                return;
            }
            if (/[a-zA-Z]/.test(telefon)) {
                alert('Greška: U polje za broj telefona ne smete unositi slova.');
                return;
            }
            if (telefon.trim().length < 9) {
                alert('Greška: Broj telefona mora imati najmanje 9 cifara.');
                return;
            }
            if (!vremeVrednost) {
                alert('Molimo vas da izaberete jedan od ponuđenih termina za vreme.');
                return;
            }

            // Kreiramo objekat sa podacima iz forme za slanje u pozadini
            var data = new FormData(forma);

            // TAČNO ISPRAVLJENO: Razbijanje GGGG-MM-DD i slaganje u DD.MM.GGGG.
            if (datumVrednost) {
                var deloviDatuma = datumVrednost.split('-'); // Deli npr. "2026-06-30"
                var srpskiFormatDatuma = deloviDatuma[2] + '.' + deloviDatuma[1] + '.' + deloviDatuma[0] + '.';
                data.set('Izabrani Datum', srpskiFormatDatuma); // Upisuje "30.06.2026." u mejl
            }

            var dugme = document.getElementById('dugmeZaSlanje');
            dugme.textContent = 'Slanje...';
            dugme.disabled = true;

            // Šaljemo podatke na Formspree preko AJAX-a (u pozadini)
            fetch(forma.action, {
                method: forma.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    alert('Hvala za upit. Vanja će Vam se javiti ubrzo.');
                    forma.reset();
                    document.querySelectorAll('.slot-dugme').forEach(slot => slot.classList.remove('aktivan'));
                    document.getElementById('izabranoVreme').value = '';
                } else {
                    alert('Došlo je do greške prilikom slanja. Molimo pokušajte ponovo.');
                }
            }).catch(error => {
                alert('Došlo je do greške sa mrežom. Molimo pokušajte ponovo.');
            }).finally(() => {
                dugme.textContent = 'Pošalji zahtev';
                dugme.disabled = false;
            });
        });
    }
});
