import { LightningElement, api, wire,track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import JSConfetti from './jsConfetti';

const FIELDS = ['Case.CSAT_Score__c'];

const ratings = {
    'Very Satisfied': { emoji: '😁', label: 'Very Satisfied', color: '#027e46' },
    'Satisfied': { emoji: '😊', label: 'Satisfied', color: '#669900' },
    'Average': { emoji: '😐', label: 'Average', color: '#ffcc00' },
    'Dissatisfied': { emoji: '☹️', label: 'Dissatisfied', color: '#ff6666' },
    'Very Dissatisfied': { emoji: '😠', label: 'Very Dissatisfied', color: '#c23934' }
};

const blastEmojisMap = {
    'Very Satisfied': ['🎉', '🎊', '💖', '😁', '✨', '🌟', '🔥'],
    'Satisfied': ['🎉', '😊', '✨', '💫'],
    'Average': ['😐', '✨', '⭐'],
    'Dissatisfied': ['☹️', '🕳️', '💤'],
    'Very Dissatisfied': ['😠', '💢', '🧨']
};

export default class CsatScore extends LightningElement {
    @api recordId;
    emoji;
    label;
    @track csatValue;
    dynamicStyle = '';
    rendered = false;
 renderedCallback() {
    this.csatValue ='Very Satisfied';
    const ratingData = ratings[this.csatValue];
    this.emoji = ratingData.emoji;
    this.label = ratingData.label;
    this.dynamicStyle = `background:${ratingData.color};color:white;padding:1rem;border-radius:1rem;text-align:center;font-size:1.5rem;`;
    this.labelStyle = `
                    background-color: ${ratingData.color};
                    color: white;
                    padding: 0.2rem 0.6rem;
                    border-radius: 0.5rem;
                `;
    this.triggerConfetti(this.csatValue);

 }
   /* @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredRecord({ error, data }) {
        if (data) {
            const csatValue = data.fields.CSAT_Score__c.value;
            const ratingData = ratings[csatValue];

            if (ratingData) {
                this.emoji = ratingData.emoji;
                this.label = ratingData.label;
                this.dynamicStyle = `background:${ratingData.color};color:white;padding:1rem;border-radius:1rem;text-align:center;font-size:1.5rem;`;

                if (!this.rendered) {
                    this.rendered = true;
                    setTimeout(() => this.triggerConfetti(csatValue), 200);
                }
            }
        } else if (error) {
            console.error(error);
        }
    }*/

    triggerConfetti(score) {
        const confetti = new JSConfetti();
        confetti.addConfetti({
            emojis: blastEmojisMap[score] || ['✨'],
            emojiSize: 20,
            confettiNumber: 50,
            speed: 4,
            randomRotation: true,
            duration: 3000
        });
    }
}