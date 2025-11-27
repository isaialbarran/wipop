"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { Package } from "@/types/database";
import { useAuth } from "@/components/Auth/AuthProvider";
import Header from "@/components/Header/Header";
import styles from "./page.module.css";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  const packageId = params.packageId as string;

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const { data, error } = await supabase
          .from("packages")
          .select("*")
          .eq("id", packageId)
          .eq("is_active", true)
          .single();

        if (error) {
          setError("Package not found");
        } else {
          setPackageData(data);
        }
      } catch {
        setError("Failed to load package");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && !user) {
      router.push("/auth");
      return;
    }

    if (user) {
      fetchPackage();
    }
  }, [user, authLoading, router, packageId, supabase]);

  const handleCheckout = async () => {
    if (!packageData || !user) return;

    setProcessing(true);
    setError("");

    try {
      const response = await fetch("/api/wipop/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: packageData.price,
          description: packageData.name,
          redirect_url: `${window.location.origin}/checkout/success`,
          customer: {
            name: user.user_metadata?.full_name || "Cliente",
            last_name: "",
            email: user.email,
            external_id: user.id,
          },
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      // Redirigir al checkout de Wipöp
      if (data.checkout_link) {
        window.location.href = data.checkout_link;
      } else {
        setError("No se pudo obtener el link de pago");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setProcessing(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div>
        <Header />
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !packageData) {
    return (
      <div>
        <Header />
        <div className={styles.error}>
          <h1>Error</h1>
          <p>{error || "Package not found"}</p>
          <button onClick={() => router.push("/")} className={styles.button}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Checkout</h1>

          <div className={styles.package}>
            <h2 className={styles.packageName}>{packageData.name}</h2>
            <p className={styles.packageDescription}>
              {packageData.description}
            </p>

            <div className={styles.price}>
              <span className={styles.currency}>€</span>
              <span className={styles.amount}>{packageData.price}</span>
            </div>

            <div className={styles.features}>
              <h3>What&apos;s included:</h3>
              <ul>
                {packageData.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.checkout}>
            <button
              onClick={handleCheckout}
              disabled={processing}
              className={styles.checkoutButton}
            >
              {processing ? "Processing..." : "Proceed to Payment"}
            </button>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <p className={styles.security}>
              Secure payment powered by Wipop
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
