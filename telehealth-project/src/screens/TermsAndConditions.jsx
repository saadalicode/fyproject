import React from "react";
import { Link } from "react-router-dom";
import "./TermsAndConditions.css";

const TermsAndConditions = () => {
    return (
        <div className="terms-parent-container">
            <div className="terms-child-container">
                <div className="terms-header">
                    <Link to={"/signup"}>
                        <div className="cancle-box">
                            <div className="left-arrow"></div>
                            <div className="right-arrow"></div>
                        </div>
                    </Link>

                    <h1 className="text-center my-4">Terms and Conditions</h1>
                </div>
                <div className="terms-content">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnam qui maiores perspiciatis libero deserunt voluptatibus autem praesentium doloremque ratione dicta fugiat illum magni eaque, ad quos veniam non explicabo molestiae sint inventore.
                    Facilis, adipisci accusantium. Beatae dolorem deleniti cupiditate obcaecati reprehenderit quia asperiores vero dolor nihil doloremque repudiandae soluta est, velit rem, repellat dolorum, quibusdam iure pariatur nisi quas iste ut veniam? Dolorum, alias!
                    Ab a enim cupiditate. Id error maxime, velit consequatur voluptate aspernatur dolore est soluta reiciendis cupiditate modi tenetur unde quidem non pariatur itaque sint facilis provident, repellat veritatis? Qui nam iste obcaecati.
                    Illum, sapiente, sint libero tempora repudiandae non ducimus minima accusantium incidunt quae dolorum enim magni, rem cum perspiciatis et. Possimus repellendus natus necessitatibus consectetur quidem autem eligendi quas explicabo maiores, adipisci repellat.
                    Rem aperiam, iste iusto repudiandae ducimus voluptate pariatur deleniti, in explicabo numquam nisi magni similique, voluptates tempore corrupti facilis repellendus maiores nesciunt accusamus aliquid! Assumenda officia consequuntur mollitia voluptate porro blanditiis? Facilis!
                    Repellat libero neque nulla illum natus vel, nobis aliquid aut quae praesentium consectetur esse sapiente voluptatibus aperiam temporibus. Molestias, incidunt ducimus vitae laboriosam eos, voluptatibus recusandae assumenda necessitatibus earum labore odit minus!
                    </div>
            </div>
        </div>
    );
}

export default TermsAndConditions;