export default function Modal() {
    return <div className="bg-modal" id="bgmodal">
  <div className="modal-content" id="modalContent">
    <div className="close" id="closePopup">+</div>
    <h3 id="infoHeading" className="info-heading"></h3>
    <div id="infoDescription"></div>
  </div>
</div>
;
}