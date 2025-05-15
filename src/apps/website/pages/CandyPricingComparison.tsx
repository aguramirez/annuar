
// Props interface
interface CandyPricingProps {
  regularPrice: number;
  premiumDiscount: number; // percentage
  isPremium: boolean;
}

const CandyPricingComparison = ({ regularPrice, premiumDiscount, isPremium }: CandyPricingProps) => {
  // Calculate premium price with discount
  const premiumPrice = regularPrice * (1 - premiumDiscount / 100);
  const savingsAmount = regularPrice - premiumPrice;
  
  return (
    <div className="card border-primary mb-4">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Comparación de Precios Candy</h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6 border-end">
            <div className="text-center mb-3">
              <h6>Precio Regular</h6>
              <h3>${regularPrice.toFixed(2)}</h3>
            </div>
          </div>
          <div className="col-md-6">
            <div className="text-center mb-3">
              <h6>
                Precio Premium 
                <span className="badge bg-warning text-dark ms-2">
                  {premiumDiscount}% OFF
                </span>
              </h6>
              <h3 className="text-primary">${premiumPrice.toFixed(2)}</h3>
            </div>
          </div>
        </div>
        
        {!isPremium && (
          <div className="text-center mt-3">
            <p className="mb-1">Haciéndote premium ahorrarías:</p>
            <h4 className="text-success">${savingsAmount.toFixed(2)}</h4>
            <p className="text-muted small">
              <i className="bi bi-info-circle me-1"></i>
              Los usuarios premium obtienen {premiumDiscount}% de descuento en todos los productos de candy
            </p>
            <a href="/subscription" className="btn btn-sm btn-warning mt-2">
              <i className="bi bi-star-fill me-2"></i>
              Hazte Premium
            </a>
          </div>
        )}
        
        {isPremium && (
          <div className="alert alert-success text-center mt-3 mb-0">
            <i className="bi bi-check-circle-fill me-2"></i>
            Estás ahorrando <strong>${savingsAmount.toFixed(2)}</strong> con tu membresía premium
          </div>
        )}
      </div>
    </div>
  );
};

export default CandyPricingComparison;